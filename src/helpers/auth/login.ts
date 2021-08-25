import { AuthUtils } from '../../utilities/auth';
import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from '../../dtos/auth/login.dto';

export class Login {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    private util: AuthUtils
  ){}

  public async login(payload: LoginDto) {
    const { ip, email, password } = payload;

    try {
      const getUser = await this.userRepo.findOne({ where: { email } });

      if (!getUser) {
        throw new HttpException(`Invalid Login Credentials`, HttpStatus.BAD_REQUEST )
      }

      const generateAuth = await this.util.authenticateUser(getUser, password, ip)

      if (generateAuth) {
        return generateAuth;
      }

      return {
        results: {...generateAuth}
      }

    } catch (e) {
       throw new HttpException(e.response ? e.response : `Error in processing user login`, e.status ? e.status : 500);
    }
  }

}