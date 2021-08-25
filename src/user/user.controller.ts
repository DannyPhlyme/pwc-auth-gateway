import { Controller, Get, Post, Body, Patch, Put, Param, Request, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from '../dtos/user/update-user.dto';
import { ChangePasswordDto } from 'src/dtos/user/change-password.dto';
import { JwtAuthGuard } from '../helpers/auth/jwt-auth.guard';
import { ChangeEmailDto } from 'src/dtos/user/change-email.dto';

@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {  }
  
  @Get('/')
  findUsers() {
    return this.userService.getUsers()
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  findProfile(@Request() request: any) {
    return this.userService.getProfile(request.user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user-referrer')
  userReferrers(@Request() request: any) {
    return this.userService.userReferrers(request.user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('/single-referrer/:user_id')
  singleReferrer(@Request() request: any, @Param('user_id') user_id: string) {
    return this.userService.singleReferrer(request.user, user_id)
  }

  @Get('/:user_id')
  findOne(@Param('user_id') user_id: number) {
    return this.userService.singleUser(user_id)
  }

  @UseGuards(JwtAuthGuard)
  @Put('/update-profile')
  updateProfile(@Body() payload: UpdateUserDto, @Request() request: any) {
    return this.userService.updateUser(payload, request.user)
  }

  @UseGuards(JwtAuthGuard)
  @Post('/change-email')
  changeEmail(@Request() request: any, @Body() payload: ChangeEmailDto) {
    return this.userService.changeEmail(request.user, payload)
  }

  @UseGuards(JwtAuthGuard)
  @Post('/change-password')
  changePassword(@Request() request:any, @Body() payload: ChangePasswordDto ) {
    return this.userService.changePassword(request.user, payload)
  }
}
