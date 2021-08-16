import { InternalServerErrorException, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { emailTemplate, Status, TokenReason } from 'src/entities/enum';
import { Token } from 'src/entities/token.entity';
import { AuthUtils } from '../../utilities/auth';
import { Formatter } from '../../utilities/Formatter';
import { UtilitiesService } from 'src/utilities/utilities.service';

export class ResendVerificationToken {
  constructor(
    @InjectRepository(User)
    private UserRepo: Repository<User>,

     @InjectRepository(Token)
    private TokenRepo: Repository<Token>,
    
    private formatUtil: Formatter,

    private authUtils: AuthUtils,
    
    private mailUtils: UtilitiesService,
  ) { }

  public async resendVerificationToken(user_id: number) {
    try {
      const get_user = await this.UserRepo.findOne({
        where: {
          id: user_id
        }
      })
      if (!get_user) {
        throw new HttpException(`Invalid user_id`, HttpStatus.NOT_FOUND);
      }

      if (!get_user.email) {
         throw new HttpException(`Please submit your email first`, HttpStatus.NOT_FOUND);
      }

      if (get_user.status == Status.ACTIVE) {
        return {
          message: `Your email is already verified`,
        }
      }

      const get_verification = await this.TokenRepo.findOne({
        where: {
          user: user_id,
          reason: TokenReason.VERIFY_EMAIL
        }
      })

      if (get_verification) {
        await this.TokenRepo.delete({id: get_verification.id})
      }

      const email_token = await this.authUtils.generateEmailToken();

      const tokenInfo = this.TokenRepo.create({
        user: get_user,
        token: email_token.token,
        reason: TokenReason.VERIFY_EMAIL,
        expiry_date: this.formatUtil.calculate_days(7)
      });

      await this.mailUtils.sendMail({
        data: emailTemplate('verificationEmail', get_user.email)
      })


      await this.TokenRepo.save(tokenInfo)

      return {
        message: `Email verification has been sent`,
      }

    } catch (e) {
      throw new HttpException(e.response ? e.response : `Error in processing user registration`, e.status ? e.status : 500);
    }
  }
}