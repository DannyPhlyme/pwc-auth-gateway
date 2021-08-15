import { MinLength, IsEmail, Min } from "class-validator"

export class LoginDto {
  @IsEmail({}, { message: "" })
  email: string

  @MinLength(2, {message: ""})
  password?: string

  ip: string

} 
