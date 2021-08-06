import { MinLength, IsEmail, Min } from "class-validator"

export class RegisterDto {
  @MinLength(2, {
    message:""
  })
  first_name: string

  @MinLength(2, {
    message:""
  })
  last_name: string

  gender: string

  occupation: string

  @IsEmail({}, { message: "" })
  email: string

  hobbies: string

  marital_status: string

  referrer?: string

  ip: string

  @MinLength(8, {
    message:""
  })
  password: string

  phone: string

} 
