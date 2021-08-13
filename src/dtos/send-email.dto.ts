import { IsNotEmpty } from 'class-validator';

export class SendEmailDto {
  @IsNotEmpty({
    message: 'Invalid request',
  })
  data: any;
}
