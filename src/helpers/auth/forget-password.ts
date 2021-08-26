import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { RegisterDto } from '../../dtos/auth/register.dto';
import { Injectable, InternalServerErrorException, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { Token } from '../../entities/token.entity';
import { emailTemplate, TokenReason } from 'src/entities/enum';
import { AuthUtils } from './../../utilities/auth';
import { Formatter } from '../../utilities/Formatter';
import { ForgotPasswordDto } from 'src/dtos/user/change-password.dto';
import { UtilitiesService } from 'src/utilities/utilities.service';

@Injectable()
export class ForgotPassword {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Token)
    private tokenRepo: Repository<Token>,

    private authUtils: AuthUtils,

    private mailUtils: UtilitiesService,
    
    private formatUtils: Formatter
  ) { }
  
  public async forgotPassword(payload: ForgotPasswordDto) {
    try {
      const { email } = payload;

      const getUser = await this.userRepo.findOne({ where: { email } });
      
      if (!getUser) {
        throw new HttpException(`This Email Does not Exist`, HttpStatus.NOT_FOUND)
      }

      const token = await this.tokenRepo.findOne({
        where: {
          user: getUser.id,
          reason: TokenReason.RESET_PASSWORD
        }
      })

      if (token) {
        await this.tokenRepo.delete({id: token.id})
      }

      const newToken = await this.authUtils.generateEmailToken()

      if (newToken.statusCode != 200) {
        return newToken
      }

      const tokenInfo = this.tokenRepo.create({
        user: getUser,
        token: newToken.token,
        reason: TokenReason.RESET_PASSWORD,
        expiry_date: this.formatUtils.calculate_minutes(15)
      })

      await this.tokenRepo.save(tokenInfo)
      
      await this.mailUtils.sendMail({
        data: emailTemplate('forgotPassword', getUser.email)
      })

      return {
        message: `Successful. A link is sent to your mail to change your password`,
      }

    } catch (e) {
     throw new HttpException(e.response ? e.response : `Error in processing user registration`, e.status ? e.status : 500)
    }
  }
}