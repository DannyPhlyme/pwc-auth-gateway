import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ChangeEmailDto } from 'src/dtos/user/change-email.dto';


export class ChangeEmail {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ){}

  public async changeEmail(user: any, payload: ChangeEmailDto) {
    try {
      const { email } = payload;
      const checkEmail = await this.userRepo.findOne({
        where: {
          email: email
        }
      })

      if (checkEmail) {
        throw new HttpException( `Email is already in use`, HttpStatus.BAD_REQUEST)
      }

      let getUser = await this.userRepo.findOne({
        where: {
          id: user.id,
          deleted_at: null
        }
      });

      if (!getUser) {
          throw new HttpException( `User Not Found`, HttpStatus.NOT_FOUND)
      }

      let oldEmail = getUser.email;
      
      if (oldEmail === email) {
        throw new HttpException( `You cannot use the same email`, HttpStatus.BAD_REQUEST)
      }

      getUser.email = email;

      await this.userRepo.save(getUser);

      return {
        results : getUser,
        message: `Email Successfully Changed`
      }
    } catch (e) {
      throw new HttpException(e.response ? e.response : `Error in processing user registration`, e.status ? e.status : 500);
    }
  }
}