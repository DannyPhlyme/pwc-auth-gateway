import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RegisterDto } from '../../dtos/auth/register.dto';
import { AuthUtils } from '../../utilities/auth';

@Injectable()
export class Registration {
  constructor(
    private util: AuthUtils
  ){}

  public async register(registerDto: RegisterDto) {
    try {
      const { last_name, phone, occupation, marital_status, gender, hobbies, email, password, first_name, referrer } = registerDto;
      let referrer_obj: any;
      if (referrer) {
        referrer_obj = await this.util.find_referrer(referrer)
        if (referrer_obj) {
          // await new SendEmail({
          //   destination: referrer_obj.email,
          // }).referralRegistered({});
        }
      }
      
      const get_referral_code = await this.util.generate_referral_code(first_name)
      if (get_referral_code.statusCode =! 200) {
        return {
          statusCode: get_referral_code.statusCode,
          message: "Referral code error"
        }
      }

      // const new_user = await User.create({
      //     email,
      //     password,
      //     first_name,
      //     last_name,
      //     referral_code: get_referral_code.code,
      //     referrer_id: referrer_obj ? referrer_obj.id : null,
      // });
      
      // const new_profile = await Profile.create({
      //     user_id: new_user.id,
      //     phone: phone ? append_ng_country_code(phone) : "",
      //     occupation,
      //     marital_status,
      //     gender,
      //     hobbies,
      // });
      
      // const emailToken = await this.util.generate_email_token()
      // if (emailToken.statusCode != 200) {
      //   return emailToken
      // }

      // let new_code = await generate_wallet_code("NA");

      //   if (new_code.status_code != 200) {
      //     return new_code;
      //   }

      //   await Wallet.create({
      //     user_id: new_user.id,
      //     code: new_code.code,
      //   });

      //   new_code = await generate_wallet_code("PT");

      //   if (new_code.status_code != 200) {
      //     return new_code;
      //   }

      //   await Wallet.create({
      //     user_id: new_user.id,
      //     type: "pointwallet",
      //     code: new_code.code,
      //   });

      // await new SendEmail({
      //     destination: email,
      //     token: emailToken.token
      //   }).verification({});

      //run some events here

      return {
        result: "",
        statusCode: 200
      }

    } catch (e) {
      throw new InternalServerErrorException({
        message: "Error in processing user registration"
      })
    }

  }
}