// import { bcrypt } from 'bcrypt';
import {  HttpException, InternalServerErrorException, Injectable, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './../entities/user.entity';
import { LoginHistory } from './../entities/login-history.entity';
import { Token } from "src/entities/token.entity";
import { Password } from '../entities/password.entity';
import { Status, TokenReason } from "src/entities/enum";
import { Formatter } from "./Formatter";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthUtils {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    
    @InjectRepository(LoginHistory)
    private loginHistoryRepo: Repository<LoginHistory>,

     @InjectRepository(Token)
    private tokenRepo: Repository<Token>,
     
     @InjectRepository(Password)
    private passwordRepo: Repository<Password>,
     
    private jwtService: JwtService,
    private formatUtil: Formatter

  ){}

  private async comparePassword(password:string, dbPassword:string) {
    return await  bcrypt.compare(password, dbPassword)
  }

  public generateString(length: number): string{
    let result: string = "";
    const characters: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  public async generateReferralCode(first_name: string) {
    try {
      const firstThree = first_name.substring(0, 3);
      const lastThree = this.generateString(3)
      const referralCode = `${firstThree}${lastThree}`.toUpperCase();

      const referralCodeExist = await this.userRepo.findOne({
        where: {
          referral_code : referralCode
        }
      })
      if (!referralCodeExist) {
        return { code: referralCode }
      }
      await this.generateReferralCode(first_name)
    } catch (e) {
      throw new InternalServerErrorException({
        message: `Error in processing referral code`,
        statusCode: 500
      })
    }
  }

  public async findReferrer(code: string) {
      const referrer = await this.userRepo.findOne({
        where: {
          referral_code : code
        }
      })
    if (!referrer) {
      return false
    }
    return referrer
  }

  public async authenticateUser(user: any, password: string, ip: string) {
    try {
      const dbPassword = await this.passwordRepo.findOne({
        where: {
          user: user.id,
          status: Status.ACTIVE
        }
      })

      if (!dbPassword) {
        throw new HttpException(`Invalid Login credentials !!!`, HttpStatus.BAD_REQUEST)
      }

      const passwordMatch = await this.comparePassword(password, dbPassword.hash);
        if (!passwordMatch) {
        throw new HttpException(`Invalid Login credentials`, HttpStatus.BAD_REQUEST)
      }

      const token = this.jwtService.sign({ user_id: user.id });
      
      let userHistory = this.loginHistoryRepo.create({
        login_date: new Date(),
        user: user.id,
        ip: ip
      })

      await this.loginHistoryRepo.save(userHistory)

      const refreshed = this.tokenRepo.create({
        token: this.generateString(150),
        reason: TokenReason.REFRESH_TOKEN,
        expiry_date: this.formatUtil.calculate_days(7),
        user: user.id
      })

      const refreshToken = await this.tokenRepo.save(refreshed)

      return {
        results: {
          token,
          refreshToken: refreshToken.token,
          expiry_date: refreshToken.expiry_date
        },
        refreshToken: {
          token_value: refreshToken.token,
          is_revoked: refreshToken.is_revoked
        },
        user
      };
      
    } catch (e) {
      throw new HttpException(e.response ? e.response : "Authenticate User error", e.status ? e.status : 500);
    }
  }

  public async generateEmailToken() {
    const token = this.generateString(32)
    try {
      const resetToken = await this.tokenRepo.findOne({
        where: {
          token: token
        }
      })

      if (!resetToken) {
        return { token, statusCode: 200 };
      }
    
      await this.generateEmailToken()
    } catch (e) {
     throw new HttpException(e.response ? e.response : `Something bad went wrong`, e.status ? e.status : 500);
    }
  }

  public async decodeToken(token: string) { 
    return this.jwtService.verify(token, {secret: process.env.SECRET_KEY})
  }

}