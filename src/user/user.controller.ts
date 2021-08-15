import { Controller, Get, Post, Body, Patch, Put, Param, Request, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from '../dtos/user/update-user.dto';
import { ChangePasswordDto } from 'src/dtos/user/change-password.dto';
import { JwtAuthGuard } from '../helpers/auth/jwt-auth.guard';
import { request } from 'express';
import { ChangeEmailDto } from 'src/dtos/user/change-email.dto';

@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {  }
  
  @Get('/')
  findUsers() {
    return this.userService.getUsers()
  }

  @Get('/:user_id')
  findOne(@Param('user_id') user_id: number) {
    return this.userService.singleUser(user_id)
  }

  @UseGuards(JwtAuthGuard)
  @Put('/update-profile')
  updateProfile(@Body() payload: UpdateUserDto, @Request() request: any) {
    console.log(">>>>>>req", request.user)
    return this.userService.updateUser(payload, request.user)
  }

  @UseGuards(JwtAuthGuard)
  @Post('/change-email')
  ChangeEmail(@Request() request: any, @Body() payload: ChangeEmailDto) {
    return this.userService.changeEmail(request.user, payload)
  }

  @UseGuards(JwtAuthGuard)
  @Post('/change-password')
  ChangePassword(@Request() request:any, @Body() payload: ChangePasswordDto ) {
    return this.userService.changePassword(request.user, payload)
  }
}
