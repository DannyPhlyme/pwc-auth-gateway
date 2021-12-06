import { Injectable } from '@nestjs/common';
import { ChangeEmailDto } from 'src/dtos/user/change-email.dto';
import { ChangePasswordDto } from 'src/dtos/user/change-password.dto';
import { ChangeEmail } from 'src/helpers/user/change-email';
import { ChangePassword } from 'src/helpers/user/change-password';
import { UserReferrer } from 'src/helpers/user/referrer';
import { UserInfo } from 'src/helpers/user/user-info';
import { UpdateUserDto } from '../dtos/user/update-user.dto';


@Injectable()
export class UserService {
  constructor(
    private userInfo: UserInfo,
    private processEmail: ChangeEmail,
    private processPassword: ChangePassword,
    private processReferrer: UserReferrer
  ) {}

  async getUsers() {
    return await this.userInfo.findUsers()
  }

  async singleUser(user_id: number) {
    return await this.userInfo.singleUser(user_id)
  }

  async getProfile(user: any) {
    return await this.userInfo.getProfile(user)
  }

  async updateUser(payload: UpdateUserDto, user: any) {
    return await this.userInfo.updateUser(payload, user)
  }

  async changeEmail(user: any, payload: ChangeEmailDto) {
    return await this.processEmail.changeEmail(user, payload)
  }

  async changePassword(user: any, payload: ChangePasswordDto) {
    return await this.processPassword.changePassword(user, payload)
  }

  async userReferrers(user: any) {
    return await this.processReferrer.userReferrers(user)
  }

   async singleReferrer(user: any, user_id: string) {
    return await this.processReferrer.singleReferrer(user, user_id)
  }
}
