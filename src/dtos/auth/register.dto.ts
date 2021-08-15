import { MinLength, IsEmail, Min } from "class-validator"

export class RegisterDto {
  @MinLength(2, {
    message:""
  })
  first_name: string

  user_id?: string

  @MinLength(2, {
    message:""
  })
  last_name: string

  gender: string

  occupation: string

  @IsEmail({}, { message: "Invalid Email address" })
  email: string

  hobbies: string

  marital_status: string

  referrer?: string

  ip: string

  @MinLength(8, {
    message:""
  })

  phone: string

  referral_code: string

  password?: string

} 
