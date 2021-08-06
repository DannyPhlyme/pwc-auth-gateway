import bcrypt from "bcryptjs"
import { BadRequestException, ExceptionFilter, HttpException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export class AuthUtils {

  private jwtService: JwtService

  private async hashPassword(password:string, dbPassword:string) {
    return await  bcrypt.compare(password, dbPassword)
  }

  private generateUserToken(auth) {
    
  }

  private generate_string(length: number): string{
    let result: string
    const characters: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  public async generate_referral_code(firstname: string): Promise<any> {
    try {
      const firstThree = firstname.substring(0, 3);
      const lastThree = this.generate_string(3)
      const referral_code = `${firstThree}${lastThree}`.toUpperCase();

      // const referralcode_exist = await User.query()
      // .where("referral_code", referralcode)
      // .first();
      if (referral_code) {
        return {statusCode: 200, code: referral_code}
      }
    } catch (e) {
      throw new InternalServerErrorException({
        message: `Error in processing referral code`,
        statusCode: 500
        })
    }
  }

  public async find_referrer(referral_code: string) {
    //find user from db
    const referrer = "referrer"

    if (!referrer) {
      return false
    }
    return referrer
  }

  public async authenticate_user(user: any, password: string, ip: string) {
    try {
      const password_match = this.hashPassword(password, user.password);
        if (!password_match) {
          throw new BadRequestException({
            message:"invalid login credentials"
        })
      }

      const token = this.jwtService.sign(user)

      // await LoginHistory.query()
      // .where({ user_id: user.id, deleted_at: null })
      // .update({ deleted_at: new Date() });

      // await LoginHistory.create({
      //   login_date: new Date(),
      //   user_id: user.id,
      //   ip,
      // });

  
      return {
          results: {user, token}
      }
      
    }catch (e) {
      throw new BadRequestException({
        message: "Authenticate User error",
        error: e
      })
    }
  }

  public async generate_email_token() {
    const token = this.generate_string(32);

    try {
      //  const reset_and_verification = await ResetAndVerification.findBy(
      // "token", token );

      // if (!reset_and_verification) {
      //   return { token, status_code: 200 };
      // }
      await this.generate_email_token();
    } catch (e) {
      throw new BadRequestException({
        message: `Unable to fetch reset and verifications`,
      })
    }
  }

  public async generate_wallet_code(type: string) {
    let code = type + "_" + this.generate_string(7);
    code = code.toUpperCase();

    try {
    //   const code_exist = await Wallet.query().where("code", code).first();
    // if (!code_exist) {
    //   return { status_code: 200, code };
    // }
      await this.generate_wallet_code(type);
    } catch (error) {
      return {
        status_code: 500,
        message: `Error in processing wallet code`,
      };
    }
  }
  
}