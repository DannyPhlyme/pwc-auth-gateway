import { InternalServerErrorException, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { Token } from '../../entities/token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { emailTemplate, TokenReason } from 'src/entities/enum';
import { UtilitiesService } from 'src/utilities/utilities.service';

export class VerifyEmail {
  constructor(
  @InjectRepository(Token)
  private TokenRepo: Repository<Token>,

  @InjectRepository(User)
  private UserRepo: Repository<User>,
  
  private mailUtils: UtilitiesService,
  ) { }
  

  public async verifyEmail(token: string, ip: string ) {
    try {
      const get_token = await this.TokenRepo.findOne({
        where: {
          token,
          reason: TokenReason.VERIFY_EMAIL
        },
        relations: ['user']
      })

      if (!get_token) {
        throw new HttpException(`Invalid Token`, HttpStatus.BAD_REQUEST)
      }

      const today = new Date().getTime();
      const exp_date = get_token.expiry_date.getTime();

      if (today > exp_date) {
        await this.TokenRepo.delete({ id: get_token.id });
        
       throw new HttpException(`This token has expired. Please generate a new one`, HttpStatus.BAD_REQUEST)
      }

      const get_user = await this.UserRepo.findOne({
        where: { id: get_token.user.id }
      });

      if (!get_user) {
         throw new HttpException(`User Not Found`, HttpStatus.NOT_FOUND) 
      }

      get_user.email_verified = true;

      await this.UserRepo.save(get_user)

      // send email
      await this.mailUtils.sendMail({
        data: emailTemplate('registerEmail', get_user.email)
      })

      //fire an event activity

      return {
        message: `Email Verification Successful`,
      }
    } catch (e) {
      throw new HttpException(e.response ? e.response : `Error in processing user registration`, e.status ? e.status : 500);
    }
  }
}