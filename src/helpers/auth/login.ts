import { AuthUtils } from '../../utilities/auth';
import { RegisterDto } from '../../dtos/auth/register.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from '../../dtos/auth/login.dto';

export class Login {
  constructor(
    @InjectRepository(User)
    private UserRepo: Repository<User>,

    private util: AuthUtils
  ){}

  public async login(payload: LoginDto) {
    const { ip, email, password } = payload;

    try {
      const get_user = await this.UserRepo.findOne({ where: { email } });

      if (!get_user) {
        throw new HttpException(`Invalid Login Credentials b`, HttpStatus.BAD_REQUEST )
      }

      const generate_auth = await this.util.authenticateUser(get_user, password, ip)

      if (generate_auth) {
        return generate_auth;
      }

      return {
        results: {...generate_auth}
      }

    } catch (e) {
       throw new HttpException(e.response ? e.response : `Error in processing user login`, e.status ? e.status : 500);
    }
  }

}