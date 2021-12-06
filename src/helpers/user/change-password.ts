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
    private userRepo: Repository<User>,

    @InjectRepository(Password)
    private passwordRepo: Repository<Password>
  ) { }

  public async changePassword(user:any, payload: ChangePasswordDto) {
    try {
      const getUser = await this.userRepo.findOne({
        id: user.id
      })

      if (!getUser) {
        throw new NotFoundException({
          message: `User Not Found`
        })
      }

      let dbPassword = await this.passwordRepo.findOne({
        where: { user: user.id, status: Status.ACTIVE}
      })

      const passwordMatch = bcrypt.compareSync(payload.old_password, dbPassword.hash);

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

      dbPassword.status = Status.INACTIVE;
      dbPassword.deleted_at = new Date()

      await this.passwordRepo.save(dbPassword)

      const newPassword = this.passwordRepo.create({
        user: user.id,
        hash: payload.new_password,
        salt: 10,
        status: Status.ACTIVE
      });

      await this.passwordRepo.save(newPassword)

      return {
        message: `Password successfully changed`,
      }

    } catch (e) {
       throw new HttpException(e.response ? e.response : `Error in processing user registration`, e.status ? e.status : 500);
    }
  }

}