import { MinLength, IsEmail, Min, IsNotEmpty } from 'class-validator';

export class ChangePasswordDto{
  @IsNotEmpty()
  @MinLength(8, {
    message:"password must be more than 8 chars"
  })
  oldPassword: string

  @IsNotEmpty()
  @MinLength(8, {
    message:"password must be more than 8 chars"
  })
  newPassword: string

} 

export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail({}, { message: "Invalid Email Address" })
  email: string
}
