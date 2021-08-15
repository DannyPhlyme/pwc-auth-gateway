import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { RegisterDto } from '../../dtos/auth/register.dto';
import { Injectable, InternalServerErrorException, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { Token } from '../../entities/token.entity';
import { TokenReason } from 'src/entities/enum';
import { AuthUtils } from './../../utilities/auth';
import { Formatter } from '../../utilities/Formatter';
import { ForgotPasswordDto } from 'src/dtos/user/change-password.dto';

@Injectable()
export class ForgotPassword {
  constructor(
    @InjectRepository(User)
    private UserRepo: Repository<User>,

    @InjectRepository(Token)
    private TokenRepo: Repository<Token>,

    private authUtils: AuthUtils,
    
    private formatUtils: Formatter
  ) { }
  
  public async forgotPassword(payload: ForgotPasswordDto) {
    try {
      const { email } = payload;

      const get_user = await this.UserRepo.findOne({ where: { email } });
      
      if (!get_user) {
        throw new HttpException(`User Does not Exist`, HttpStatus.NOT_FOUND)
      }

      const token = await this.TokenRepo.findOne({
        where: {
          user: get_user.id,
          reason: TokenReason.RESET_PASSWORD
        }
      })

      if (token) {
        await this.TokenRepo.delete({id: token.id})
      }

      const new_token = await this.authUtils.generateEmailToken()

      if (new_token.statusCode != 200) {
        return new_token
      }

      const tokenInfo = this.TokenRepo.create({
        user: get_user,
        token: new_token.token,
        reason: TokenReason.RESET_PASSWORD,
        expiry_date: this.formatUtils.calculate_minutes(15)
      })

     await this.TokenRepo.save(tokenInfo)

      // send email

      return {
        message: `Successful. A link is sent to your mail to change your password`,
      }

    } catch (e) {
     throw new HttpException(e.response ? e.response : `Error in processing user registration`, e.status ? e.status : 500)
    }
  }
}