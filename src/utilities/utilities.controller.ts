import { Body, Controller, Get, Post } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { SendEmailDto } from '../dtos/send-email.dto';
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

  @EventPattern('hello')
  async hello(data: string) {
    console.log(data); 
  }
}
