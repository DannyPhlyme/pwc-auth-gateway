import { IsNotEmpty } from 'class-validator';

export class EmailTemplateDto {
  @IsNotEmpty({
    message: 'template ID is required'
  })
  emailName: string

  @IsNotEmpty({
    message:"recipient's email is required"
  })
  email: string

  token?: string 
}