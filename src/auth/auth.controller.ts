import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Ip, Injectable, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from '../dtos/auth/register.dto';
import { JwtAuthGuard } from 'src/helpers/auth/jwt-auth.guard';
import { ResetPasswordDto, TokenDto, resendVerificationDto } from '../dtos/auth/reset-password';
import { ForgotPasswordDto } from 'src/dtos/user/change-password.dto';
import { Role } from 'src/entities/role.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/entities/permission.entity';
import { RoleDto } from '../dtos/auth/role.dto';
import { LoginDto } from '../dtos/auth/login.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,

     @InjectRepository(Permission)
    private permissionRepo: Repository<Permission>,

  ) { }
  @Post('/registration')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('/login')
  login(@Body() payload: LoginDto, @Ip() Ip: string) {
    let { email, password, ip } = payload;
    ip = Ip
    return this.authService.login({email, password, ip});
  }

  @Post('/forgot-password')
  forgetPassword(@Body() payload: ForgotPasswordDto) {
    return this.authService.forgotPassword(payload)
  }
  
  @Post('/refresh-token')
  refreshToken(@Body() refresh_token: TokenDto) {
    return this.authService.refreshToken(refresh_token)
  }

  @Post('/reset-password/:token')
  resetPassword(@Param('token')token: string, @Body() payload: ResetPasswordDto, @Ip() ip: string) {
    return this.authService.resetPassword(payload, token, ip)
  }

  @Get('/resend-verification-token/:user_id')
  resendVerificationToken(@Param('user_id') user_id: string) {
    return this.authService.resendVerificationToken(user_id)
  }

  @Get('/verify-email/:token')
  verifyEmail(@Param('token') token: string, @Ip() ip: string) {
    return this.authService.verifyEmail(token, ip)
  }

  @Post('/check-unique-credentials/:credential_name')
  checkUniqueCredentials(@Param('credential_name') credential_name: string, @Body('credential') credential: string) {
    return this.authService.checkUniqueCredentials(credential_name, credential)
  }

  @Get('/find-referrer-credentials/:code')
  findReferrerCredentials(@Param('code') code:string) {
    return this.authService.findReferrerCredentials(code)
  }

  @Post('/role')
  async createRole(@Body() payload: RoleDto) {
    const {name, description} = payload
    const Role = this.roleRepo.create({
      name,
      description
    })

    await this.roleRepo.save(Role)
  }

  @Post('/permission/:title')
  async createPermission(@Param('title') title: string,  @Body() payload: RoleDto) {
    const { action, description } = payload
    
    const role = await this.roleRepo.findOne({
      where: {title}
    })

    const permission = this.permissionRepo.create({
      action,
      description,
      role: role,
      active: true
    })

    await this.permissionRepo.save(permission)
  }
}

