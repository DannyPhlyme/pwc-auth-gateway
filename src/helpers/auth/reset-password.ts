import { ResetPasswordDto } from './../../dtos/auth/reset-password';
import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from 'src/entities/token.entity';
import { emailTemplate, Status, TokenReason } from 'src/entities/enum';
import { User } from 'src/entities/user.entity';
import { Password } from 'src/entities/password.entity';
import * as bcrypt from 'bcrypt';
import { UtilitiesService } from 'src/utilities/utilities.service';

export class ResetPassword {
  constructor(
    @InjectRepository(Token)
    private tokenRepo: Repository<Token>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Password)
    private passwordRepo: Repository<Password>,

    private mailUtils: UtilitiesService
){}
  
  public async resetPassword(payload: ResetPasswordDto, token: string, ip: string) {
    try {   
      const getResetInfo = await this.tokenRepo.findOne({
        where: {
          token,
          reason: TokenReason.RESET_PASSWORD
        },
        relations:['user']
      })
      
      if (!getResetInfo) {
        throw new HttpException(`Invalid Token Provided`, HttpStatus.BAD_REQUEST)
      }

      const today = new Date().getTime();

      const expDate = getResetInfo.expiry_date.getTime();
      if (today > expDate) {
        await this.tokenRepo.delete(getResetInfo.id)

         throw new HttpException(`This token has expired. Please generate a new one`, HttpStatus.BAD_REQUEST)
      }

      const getUser = await this.userRepo.findOne ({
        where: {
          id: getResetInfo.user.id
        },
      });

      if (!getUser) {
        throw new HttpException(`User Not Found`, HttpStatus.NOT_FOUND) 
      }

      let dbPassword = await this.passwordRepo.findOne({
        where: {
          user: getUser.id,
          status: Status.ACTIVE
      }
      })

      const passwordMatch = bcrypt.compareSync(payload.password, dbPassword.hash)
      
      if (passwordMatch) {
        await this.tokenRepo.delete({ token: token });
         throw new HttpException( `You're already using this password. Please use a different password`, HttpStatus.BAD_REQUEST)
      }

      const passwordInfo = this.passwordRepo.create({
        user: getUser,
        hash: payload.password,
        salt: 10,
        status: Status.ACTIVE
      });

      dbPassword.status = Status.INACTIVE;
      dbPassword.deleted_at = new Date();

      await this.passwordRepo.save(dbPassword)
      await this.passwordRepo.save(passwordInfo)

      // fire an event, sending the ip address

      //Send reset password email
      await this.mailUtils.sendMail({
        data: emailTemplate('reset_password', getUser.email,)
      })

      return {
        message: `Password has been reset.`,
      }

    } catch (e) {
      throw new HttpException(e.response ? e.response : `something went wrong`, e.status ? e.status : 500);
    }
  }
}