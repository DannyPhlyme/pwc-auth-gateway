import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { RegisterDto } from '../../dtos/auth/register.dto';
import { AuthUtils } from '../../utilities/auth';
import { Formatter } from './../../utilities/Formatter';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from '../../entities/token.entity';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Password } from '../../entities/password.entity';
import { TokenReason, MaritalStatus, Gender, emailTemplate, Roles } from 'src/entities/enum';
import { Profile } from '../../entities/profile.entity';
import { UtilitiesService } from '../../utilities/utilities.service';
import { Role } from 'src/entities/role.entity';


@Injectable()
export class Registration {
  constructor(
    @InjectRepository(Token)
    private tokenRepo: Repository<Token>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Password)
    private passwordRepo: Repository<Password>,

    @InjectRepository(Role)
    private roleRepo: Repository<Role>,


    @InjectRepository(Profile)
    private profileRepo: Repository<Profile>,

    private mailUtils: UtilitiesService,

    private authUtil: AuthUtils,
    private formatUtil: Formatter

  ){}

  public async register(registerDto: RegisterDto) {
    try {
      const { first_name, referrer, phone, email, password, occupation, last_name, hobbies } = registerDto;

      let referrerObj: any

      if (referrer) {
        referrerObj = await this.authUtil.findReferrer(referrer)

        if (referrerObj) {
          await this.mailUtils.sendMail({
            data: emailTemplate('referralRegistered', email)
          })
        }
      }
      
      const getReferralCode = await this.authUtil.generateReferralCode(first_name)

      if (!getReferralCode) {
        return {
          message: "Referral code error"
        }
      }

      const getUser = await this.userRepo.findOne({
        where: {
          email
        }
      });

      if (getUser) {
        throw new HttpException('Email already Exists', HttpStatus.BAD_REQUEST);
      }

      const role = await this.roleRepo.findOne({
        where: {
          name: Roles.CLIENT
        }
      })
      
      let newUser: any = this.userRepo.create({
        referrer_id: referrerObj ? referrerObj.id : null,
        email,
        last_name,
        first_name,
        referral_code: getReferralCode.code,
        role,
      })

      newUser = await this.userRepo.save(newUser)

      const profile = this.profileRepo.create({
        user: newUser,
        phone: phone ? this.formatUtil.append_ng_country_code(phone) : "",
        hobbies,
        occupation,
        marital_status: MaritalStatus.SINGLE,
        gender: Gender.MALE
      })

      await this.profileRepo.save(profile)

      let userPassword: any = this.passwordRepo.create({
        user: newUser,
        hash: password,
        salt: 10
      })

      await this.passwordRepo.save(userPassword)

      const emailToken = await this.authUtil.generateEmailToken()
      if (emailToken.statusCode != 200) {
        return emailToken
      }

      let userToken:any = this.tokenRepo.create({
        user: newUser,
        token: emailToken.token,
        reason: TokenReason.VERIFY_EMAIL,
        expiry_date: this.formatUtil.calculate_days(7)
      })

      await this.tokenRepo.save(userToken)
    
      await this.mailUtils.sendMail({
        data: emailTemplate('verificationEmail', email, emailToken.token)
      });

      await this.mailUtils.addToAweber({
        'email': email,
        'name': first_name
      })

      return {
        result: newUser
      }
    } catch (e) {
      throw new HttpException(e.response ? e.response : `Error in processing user registration`, e.status ? e.status : 500);
    }
  }
}