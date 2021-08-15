import * as bcrypt from "bcrypt"
import { BadRequestException, ExceptionFilter, HttpException, InternalServerErrorException, NotFoundException, Injectable, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './../entities/user.entity';
import { LoginHistory } from './../entities/login-history.entity';
import { Token } from "src/entities/token.entity";
import { Password } from '../entities/password.entity';
import { Status } from "src/entities/enum";

@Injectable()
export class AuthUtils {
  constructor(
    @InjectRepository(User)
    private UserRepo: Repository<User>,
    
    @InjectRepository(LoginHistory)
    private LoginHistoryRepo: Repository<LoginHistory>,

     @InjectRepository(Token)
    private TokenRepo: Repository<Token>,
     
     @InjectRepository(Password)
    private PasswordRepo: Repository<Password>,
     
     private jwtService: JwtService

  ){}

  private async comparePassword(password:string, dbPassword:string) {
    return await  bcrypt.compare(password, dbPassword)
  }

  public generateString(length: number): string{
    let result: string = "";
    const characters: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    const charactersLength = characters.length;
    console.log("====length", charactersLength)
    for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  public async generateReferralCode(first_name: string): Promise<any> {
    try {
      const firstThree = first_name.substring(0, 3);
      const lastThree = this.generateString(3)
      const referral_code = `${firstThree}${lastThree}`.toUpperCase();

      const referral_code_exist = await this.UserRepo.findOne({
        where: {
          referral_code : referral_code
        }
      })
      if (!referral_code_exist) {
        return { statusCode: 200, code: referral_code }
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
      const referrer = await this.UserRepo.findOne({
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
      const dbPassword = await this.PasswordRepo.findOne({
        where: {
          user: user.id,
          status: Status.ACTIVE
        }
      })

      if (!dbPassword) {
        throw new HttpException(`Invalid Login credentials !!!`, HttpStatus.BAD_REQUEST)
      }

      const password_match = await this.comparePassword(password, dbPassword.hash);
        if (!password_match) {
        throw new HttpException(`Invalid Login credentials !`, HttpStatus.BAD_REQUEST)
      }

      const token = this.jwtService.sign({ user_id: user.id });
      
      let user_history = this.LoginHistoryRepo.create({
        login_date: new Date(),
        user: user.id,
        ip: ip
      })

      await this.LoginHistoryRepo.save(user_history)

      return {user, token}
      
    } catch (e) {
      throw new HttpException(e.response ? e.response : "Authenticate User error", e.status ? e.status : 500);
    }
  }

  public async generateEmailToken() {
    const token = this.generateString(32)

    try {
      const resetToken = await this.TokenRepo.findOne({
        where: {
          token: token
        }
      })

      if (!resetToken) {
        return { token, statusCode: 200 };
      }
    
      await this.generateEmailToken()
    } catch (e) {
      throw new BadRequestException({
        message: `Unable to fetch reset and verifications`,
      })
    }
  }
  
}