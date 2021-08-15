import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Ip } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from '../dtos/auth/register.dto';
import { JwtAuthGuard } from 'src/helpers/auth/jwt-auth.guard';
import { ResetPasswordDto } from '../dtos/auth/reset-password';
import { ChangeEmail } from 'src/helpers/user/change-email';
import { ForgotPasswordDto } from 'src/dtos/user/change-password.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @Post('/registration')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('/login')
  login(@Body() registerDto: RegisterDto) {
    return this.authService.login(registerDto);
  }

  @Post('/forgot-password')
  forgetPassword(@Body() payload: ForgotPasswordDto) {
    return this.authService.forgotPassword(payload)
  }

  @Post('/reset-password/:token')
  resetPassword(@Param('token')token, @Body() payload: ResetPasswordDto, @Ip() ip) {
    
    return this.authService.resetPassword(payload, token, ip)
  }

  @Get('/resend-verification-token/:user_id')
  resendVerificationToken(@Param('user_id') user_id: number) {
    return this.authService.resendVerificationToken(user_id)
  }

  @Get('/verify-email/:token')
  verifyEmail(@Param('token') token: string, @Ip() ip: string) {
    return this.authService.verifyEmail(token, ip)
  }

  @Post('/check-unique-credentials/:credential_name')
  checkUniqueCredentials(@Param('credential_name') credential_name: string, @Body() credential: string) {
    return this.authService.checkUniqueCredentials(credential_name, credential)
  }

  @Get('/find-referrer-credentials/:code')
  findReferrerCredentials(@Param('code') code) {
    return this.authService.findReferrerCredentials(code)
  }
}

