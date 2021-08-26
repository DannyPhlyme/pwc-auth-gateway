import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Formatter } from 'src/utilities/Formatter';
import { AuthUtils } from '../../utilities/auth';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager,getManager, getConnection, createQueryBuilder, Repository, getRepository} from 'typeorm';
import { User } from '../../entities/user.entity';
import { Profile } from 'src/entities/profile.entity';

@Injectable()
export class ReferralCredential {
  constructor(
    @InjectRepository(User)
    private UserRepo: Repository<User>,

    @InjectRepository(Profile)
    private ProfileRepo: Repository<Profile>,

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

      let get_user: any;

      if (credential_name == 'email') {
        get_user = await this.UserRepo.findOne({
          where: {
            email: credential
          }
        })
        return {
           results: { exist: get_user ? true : false }
        }
      }

      get_user = await this.ProfileRepo.findOne({
        where: {
          phone: credential
        }
      })

      return {
        results: { exist: get_user ? true : false },
        message: get_user ? `${credential_name} already exist` : `${credential_name} does not exist`
      }

    } catch (e) {
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