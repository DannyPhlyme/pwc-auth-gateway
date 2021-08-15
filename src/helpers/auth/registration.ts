import { Injectable, InternalServerErrorException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { RegisterDto } from '../../dtos/auth/register.dto';
import { AuthUtils } from '../../utilities/auth';
import { Formatter } from './../../utilities/Formatter';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from '../../entities/token.entity';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Password } from '../../entities/password.entity';
import { TokenReason, MaritalStatus, Gender } from 'src/entities/enum';
import { Profile } from '../../entities/profile.entity';
import { response } from 'express';


@Injectable()
export class Registration {
  constructor(
    @InjectRepository(Token)
    private TokenRepo: Repository<Token>,

    @InjectRepository(User)
    private UserRepo: Repository<User>,

    @InjectRepository(Password)
    private PasswordRepo: Repository<Password>,

    @InjectRepository(Profile)
    private ProfileRepo: Repository<Profile>,

    private authUtil: AuthUtils,
    private formatUtil: Formatter
  ){}

  public async register(registerDto: RegisterDto) {
    try {
      const { first_name, referrer, phone, email, password, occupation, last_name, hobbies} = registerDto;
      
      let referrerObj: any;

      if (referrer) {
        referrerObj = await this.authUtil.findReferrer(referrer)
        if (referrerObj) {
          //send email
        }
      }
      
      const get_referral_code = await this.authUtil.generateReferralCode(first_name)

      if (get_referral_code.statusCode =! 200) {
        return {
          statusCode: get_referral_code.statusCode,
          message: "Referral code error"
        }
      }

      const get_user = await this.UserRepo.findOne({
        where: {
          email
        }
      });

      if (get_user) {
        throw new HttpException('Email already Exists', HttpStatus.BAD_REQUEST);
      }

      console.log("======emai", email)
      let new_user: any = this.UserRepo.create({
        referrer_id: referrerObj ? referrerObj.id : null,
        email,
        last_name,
        first_name,
        referral_code: get_referral_code.code,
      })

      new_user = await this.UserRepo.save(new_user)

      let user_password: any = this.PasswordRepo.create({
        user: new_user,
        hash: password,
        salt: 10
      })
      
      user_password = this.PasswordRepo.save(user_password)

      let user_profile: any = this.ProfileRepo.create({
        user: new_user.id,
        phone: phone ? this.formatUtil.append_ng_country_code(phone) : "",
        hobbies,
        occupation,
        marital_status: MaritalStatus.SINGLE,
        gender: Gender.MALE
      })

      user_profile = await this.ProfileRepo.save(user_profile)

      const emailToken = await this.authUtil.generateEmailToken()
      if (emailToken.statusCode != 200) {
        return emailToken
      }

      let user_token:any = this.TokenRepo.create({
        user: new_user,
        token: emailToken.token,
        reason: TokenReason.VERIFY_EMAIL,
        expiry_date: this.formatUtil.calculate_days(7)
      })

      user_token = this.TokenRepo.save(user_token)
      //either create a wallet for user
    
      //send email

      //run some events here

      return {
        result: new_user,
      }

    } catch (e) {
      throw new HttpException(e.response ? e.response : `Error in processing user registration`, e.status ? e.status : 500);
    }
  }
}