import { Body, Controller, Get, Post } from '@nestjs/common';
import { SendEmailDto } from '../dtos/auth/send-email.dto';
import { UtilitiesService } from './utilities.service';

@Controller('utilities')
export class UtilitiesController {
  constructor(private readonly utilService: UtilitiesService) {}
  @Post('send-email')
  sendMail(@Body() payload: SendEmailDto): Promise<void> {
    return this.utilService.sendMail(payload);
  }

  @Get()
  getHello(): string {
    return 'Hello Utility';
  }
}
