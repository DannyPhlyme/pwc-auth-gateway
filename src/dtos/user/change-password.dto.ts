import { MinLength, IsEmail, Min } from "class-validator"

export class ChangePasswordDto{
  @MinLength(8, {
    message:"password must be more than 8 chars"
  })
  old_password: string

   @MinLength(8, {
    message:"password must be more than 8 chars"
  })
  new_password: string

} 

export class ForgotPasswordDto {
  @IsEmail({}, { message: "Invalid Email Address" })
  email: string
}
