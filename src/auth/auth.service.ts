import { Injectable } from '@nestjs/common';
import { RegisterDto } from '../dtos/auth/register.dto';
import { UpdateAuthDto } from '../dtos/auth/update-auth.dto';
import { Registration } from './../helpers/auth/registration';
import { Login } from './../helpers/auth/login';

@Injectable()
export class AuthService {
  private registration: Registration
  private authLogin: Login

  async register(registerDto: RegisterDto) {
    return await this.registration.register(registerDto)
  }

  async login(registerDto: RegisterDto) {
    return await this.authLogin.login(registerDto)
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