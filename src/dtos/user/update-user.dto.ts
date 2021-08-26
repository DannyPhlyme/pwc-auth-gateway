import { MinLength } from 'class-validator';
import { Gender, MaritalStatus } from 'src/entities/enum';

export class UpdateUserDto {
   @MinLength(2, {
    message:""
  })
  first_name: string

  @MinLength(2, {
    message:""
  })
  last_name: string

  gender: Gender

  occupation: string

  hobbies: string

  marital_status: MaritalStatus

  ip: string

  @MinLength(8, {
    message:""
  })
  phone: string
}
