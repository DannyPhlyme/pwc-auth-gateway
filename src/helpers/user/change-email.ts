import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { BadRequestException, NotFoundException, InternalServerErrorException, HttpException, HttpStatus } from '@nestjs/common';
import { ChangeEmailDto } from 'src/dtos/user/change-email.dto';


export class ChangeEmail {
  constructor(
    @InjectRepository(User)
    private UserRepo: Repository<User>,
  ){}

  public async changeEmail(user: any, payload: ChangeEmailDto) {
    try {
      const {email} = payload
      const check_email = await this.UserRepo.findOne({
        where: {
          email: email
        }
      })

      if (check_email) {
        throw new HttpException( `Email is already in use`, HttpStatus.BAD_REQUEST)
      }

      let get_user = await this.UserRepo.findOne({
        where: {
          id: user.id,
          deleted_at: null
        }
      });

      if (!get_user) {
          throw new HttpException( `User Not Found`, HttpStatus.NOT_FOUND)
      }

      console.log('======get_user', get_user)
      let old_email = get_user.email;
      
      if (old_email === email) {
        throw new HttpException( `You cannot use the same email`, HttpStatus.BAD_REQUEST)
      }

      get_user.email = email;

      await this.UserRepo.save(get_user);

      return {
        results : get_user,
        message: `Email Successfully Changed`
      }
    } catch (e) {
      throw new HttpException(e.response ? e.response : `Error in processing user registration`, e.status ? e.status : 500);
    }
  }
}