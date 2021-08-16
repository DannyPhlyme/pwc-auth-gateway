import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { BadRequestException, NotFoundException, InternalServerErrorException, HttpException, HttpStatus } from '@nestjs/common';
import { ChangePasswordDto } from 'src/dtos/user/change-password.dto';
import { Password } from '../../entities/password.entity';
import * as bcrypt from 'bcrypt';
import { Status } from 'src/entities/enum';


export class ChangePassword {
  constructor(
    @InjectRepository(User)
    private UserRepo: Repository<User>,

    @InjectRepository(Password)
    private PasswordRepo: Repository<Password>
  ) { }

  public async changePassword(user:any, payload: ChangePasswordDto) {
    try {
      const get_user = await this.UserRepo.findOne({
        id: user.id
      })

      if (!get_user) {
        throw new NotFoundException({
          message: `User Not Found`
        })
      }

      let db_password = await this.PasswordRepo.findOne({
        where: { user: user.id, status: Status.ACTIVE}
      })

      console.log("=====>db_pass", db_password)

      const passwordMatch = bcrypt.compareSync(payload.old_password, db_password.hash);

      if (!passwordMatch) {
        throw new BadRequestException({
          message: `Old Password is wrong. Please input the correct password`,
        })
      }

      if (payload.new_password == payload.old_password) {
        throw new BadRequestException({
          message: `Old Password can not be the same with New password`,
        })
      }

      db_password.status = Status.INACTIVE;
      db_password.deleted_at = new Date()

      await this.PasswordRepo.save(db_password)

      const newPassword = this.PasswordRepo.create({
        user: user.id,
        hash: payload.new_password,
        salt: 10,
        status: Status.ACTIVE
      });

      await this.PasswordRepo.save(newPassword)

      return {
        statusCode: 200,
        message: `Password successfully changed`,
      }

    } catch (e) {
      console.log("=====e", e)
       throw new HttpException(e.response ? e.response : `Error in processing user registration`, e.status ? e.status : 500);
    }
  }

}