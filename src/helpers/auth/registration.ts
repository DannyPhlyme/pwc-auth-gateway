import { Injectable } from "@nestjs/common";
import { RegisterDto } from '../../dtos/auth/register.dto';

@Injectable()
export class Registration {
  constructor(

  ){}

  public async register(registerDto: RegisterDto) {
    const { last_name, referrer } = registerDto;
    let referrer_obj: any;
    if (referrer) {
    
    }
  }
}