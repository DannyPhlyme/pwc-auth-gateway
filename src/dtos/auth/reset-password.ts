import { IsEmail, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @MinLength(8, {
    message:"password must be more than 8 chars"
  })
  password: string
}
