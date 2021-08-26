import { Body, Controller, Get, Post } from '@nestjs/common';
<<<<<<< HEAD
import { EventPattern } from '@nestjs/microservices';
import { SendEmailDto } from '../dtos/send-email.dto';
=======
import { SendEmailDto } from '../dtos/auth/send-email.dto';
>>>>>>> 5665fef976d7613c6803eeab7e35bc014a4eef61
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
