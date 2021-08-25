import { MinLength, IsEmail, IsString, IsEnum,  Min } from "class-validator"
import { Gender, MaritalStatus } from "src/entities/enum"

export class RegisterDto {
  @MinLength(2, {
    message:"first_name should not be less than 2"
  })
  first_name: string

  user_id?: string

  @MinLength(2, {
    message:"last_name should not be less than 2"
  })
  last_name: string

  @IsEnum(Gender)
  gender: string

  @MinLength(2, {
    message:"occupation field is required"
  })
  occupation: string

  @IsEmail({}, { message: "Invalid Email address" })
  email: string

  hobbies: string

  @IsEnum(MaritalStatus)
  marital_status: string

  referrer?: string

  ip: string

  @MinLength(11, {
    message:"phone_number should not be lesser than 11"
  })
  phone: string

  referral_code: string

  @MinLength(8, {
    message:"password should not be lesser than 8 chars"
  })
  password?: string

} 
