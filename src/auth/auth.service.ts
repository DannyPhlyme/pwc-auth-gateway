import { Injectable } from '@nestjs/common';
import { RegisterDto } from '../dtos/auth/register.dto';
import { UpdateAuthDto } from '../dtos/auth/update-auth.dto';

@Injectable()
export class AuthService {

  register(createAuthDto: RegisterDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
