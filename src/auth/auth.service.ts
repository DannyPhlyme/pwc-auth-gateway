import { Injectable } from '@nestjs/common';
import { RegisterDto } from '../dtos/auth/register.dto';
import { Registration } from './../helpers/auth/registration';
import { Login } from './../helpers/auth/login';
import { ForgotPassword } from './../helpers/auth/forget-password';
import { ResetPasswordDto } from '../dtos/auth/reset-password';
import { ResetPassword } from './../helpers/auth/reset-password';
import { ResendVerificationToken } from '../helpers/auth/resend-verification-token';
import { VerifyEmail } from '../helpers/auth/verify-email';
import { ReferralCredential } from 'src/helpers/auth/referral-credentials';
import { ForgotPasswordDto } from 'src/dtos/user/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private registration: Registration,
    private authLogin: Login,
    private authForgetPassword: ForgotPassword,
    private authResetPassword: ResetPassword,
    private authResendToken: ResendVerificationToken,
    private authVerifyEmail: VerifyEmail,
    private authReferral: ReferralCredential
  ){}
  
  async register(payload: RegisterDto) {
    return await this.registration.register(payload)
  }

  async login(payload: RegisterDto) {
    return this.authLogin.login(payload)
  }

  async forgotPassword(payload: ForgotPasswordDto) {
    return await this.authForgetPassword.forgotPassword(payload)
  }

  async resetPassword(payload: ResetPasswordDto, token, ip) {
    return await this.authResetPassword.resetPassword(payload, token, ip)
  }

  async resendVerificationToken(user_id: number) {
    return await this.authResendToken.resendVerificationToken(user_id)
  }

  async verifyEmail(token:string, ip:string) {
    return await this.authVerifyEmail.verifyEmail(token, ip)
  }

  // query error, to be fixed
  async checkUniqueCredentials(credential_name:string, credential:string) {
    return await this.authReferral.checkUniqueCredentials(credential_name, credential)
  }

  async findReferrerCredentials(code) {
    return this.authReferral.findReferrerCredentials(code)
  }
}