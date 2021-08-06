import { AuthUtils } from '../../utilities/auth';
import { RegisterDto } from '../../dtos/auth/register.dto';
import { InternalServerErrorException, BadRequestException } from '@nestjs/common';

export class Login {
  constructor(
    private util: AuthUtils
  ){}

  public async login(registerDto: RegisterDto) {
    const { ip, email, password } = registerDto;

    try {
      // const get_user = await User.query().where("email", email).first();

      // if (get_user) {
      //   throw new BadRequestException({
      //     message:"Invalid login credentials"
      //   })
      // }

      // const generate_auth = await this.util.authenticate_user(get_user, ip, password)

      // if (generate_auth.statusCode != 200) {
      //   return generate_auth;
      // }

      return {
        statusCode: 200,
        // results: {...generate_auth.results}
      }

    } catch (e) {
      throw new InternalServerErrorException({
        message: `Error in processing user login`,
      })
    }
  }

}