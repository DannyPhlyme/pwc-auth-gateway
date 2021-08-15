import { InternalServerErrorException, BadRequestException, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Formatter } from 'src/utilities/Formatter';
import { AuthUtils } from '../../utilities/auth';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager,getManager, getConnection, createQueryBuilder, Repository, getRepository} from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class ReferralCredential {
  constructor(
    @InjectRepository(User)
    private UserRepo: Repository<User>,

    private authUtils: AuthUtils,

    private formatUtils: Formatter
  ){}


  public async checkUniqueCredentials(credential_name:string, credential: string) {
    try {
      const check_enum = ['email', 'phonenumber'].indexOf(credential_name);

      if (check_enum < 0) {
       throw new HttpException(`Enter the right credential`, HttpStatus.BAD_REQUEST);
      }
      
      if (credential_name === 'phonenumber') {
        if (!credential.includes('+')) {
          credential = this.formatUtils.append_ng_country_code(credential);
        }
      }

      // const get_user = await getManager().createQueryBuilder().select(`user.${credential_name}`, credential_name)
      // .from('users' ).getOne()
      
      // return {
      //   results: { exist: get_user ? true : false },
      //   message: get_user ? `${credential_name} already exist` : `${credential_name} does not exist`
      // }
    } catch (e) {
      console.log('========e', e)
       throw new HttpException(e.response ? e.response : `Error in processing user registration`, e.status ? e.status : 500);
    }
  }

  public async findReferrerCredentials(code: string) {
    try {
       const referrer = await this.authUtils.findReferrer(code);
      
      if (referrer) {
        return {
          results: referrer,
        };

      } else {
        return {
          label: `Account does not exist`,
          message: `You provide an invalid referrer code`,
        }
      }
    } catch (e) {
       throw new HttpException(e.response ? e.response : `Error in processing user registration`, e.status ? e.status : 500);
    }
  }
}