import { ResetPasswordDto } from './../../dtos/auth/reset-password';
import { InternalServerErrorException, NotFoundException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from 'src/entities/token.entity';
import { Status, TokenReason } from 'src/entities/enum';
import { User } from 'src/entities/user.entity';
import { Password } from 'src/entities/password.entity';
import * as bcrypt from 'bcrypt';

export class ResetPassword {
  constructor(
    @InjectRepository(Token)
    private TokenRepo: Repository<Token>,

    @InjectRepository(User)
    private UserRepo: Repository<User>,

    @InjectRepository(Password)
    private PasswordRepo: Repository<Password>
){}
  
  public async resetPassword(payload: ResetPasswordDto, token: string, ip: string) {
    try {
      const get_reset_info = await this.TokenRepo.findOne({
        where: {
          token: token,
          reason: TokenReason.RESET_PASSWORD
        },
        relations:['user']
      })
      
      if (!get_reset_info) {
        throw new HttpException(`Invalid Token Provided`, HttpStatus.BAD_REQUEST)
      }

      const today = new Date().getTime();

      const exp_date = get_reset_info.expiry_date.getTime();
      if (today > exp_date) {
        await this.TokenRepo.delete(get_reset_info.id)

         throw new HttpException(`This token has expired. Please generate a new one`, HttpStatus.BAD_REQUEST)
      }

      const get_user = await this.UserRepo.findOne({
        where: {
          id: get_reset_info.user.id
        },
      });

      if (!get_user) {
        throw new HttpException(`User Not Found`, HttpStatus.NOT_FOUND) 
      }

      let dbPassword = await this.PasswordRepo.findOne({
        where: {
          user: get_user.id,
          status: Status.ACTIVE
      }
      })

      const passwordMatch = bcrypt.compareSync(payload.password, dbPassword.hash)
      
      if (passwordMatch) {
        await this.TokenRepo.delete({ token: token });
         throw new HttpException( `You're already using this password. Please use a different password`, HttpStatus.BAD_REQUEST)
      }

      const passwordInfo = this.PasswordRepo.create({
        user: get_user,
        hash: payload.password,
        salt: 10,
        status: Status.ACTIVE
      });

      dbPassword.status = Status.INACTIVE;
      dbPassword.deleted_at = new Date();

      
      await this.PasswordRepo.save(dbPassword)
      await this.PasswordRepo.save(passwordInfo)

      // fire an event, sending the ip address

      //Send reset password email

      return {
        message: `Password has been reset.`,
      }

    } catch (e) {
      console.log("====e", e)
      throw new HttpException(e.response ? e.response : `something went wrong`, e.status ? e.status : 500);
    }
  }
}