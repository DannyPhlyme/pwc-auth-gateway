import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { Injectable, HttpStatus, HttpException } from '@nestjs/common';

@Injectable()
export class UserReferrer {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) { }

  public async userReferrers(user: any) {
    try {
      const getUser = await this.userRepo.findOne({
        where: {
          id: user.id
        }
      })

      if (!getUser) {
        throw new HttpException(`User Not Found`, HttpStatus.NOT_FOUND)
      }

      const getReferrers = await this.userRepo.find({
        where: {
          referrer_id: getUser.id
        }
      })

      if (!getReferrers) {
        throw new HttpException(`Referrer Not Found`, HttpStatus.NOT_FOUND)
      }

      return { getReferrers }

    } catch (e) {
      throw new HttpException(e.response ? e.response : `Error in getting user referrer`, e.status ? e.status : 500);
    }
  }

  public async singleReferrer(user: any, user_id: string) {
    try {
      const getUser = await this.userRepo.findOne({
        where: {
          id: user.id
        }
      })
      
      if (!getUser) {
         throw new HttpException(`User Not Found`, HttpStatus.NOT_FOUND)
      }

       const getReferrer = await this.userRepo.find({
        where: {
          referrer_id: getUser.id
        }
       })
      
      if (!getReferrer) {
        throw new HttpException(`Referrer Not Found`, HttpStatus.NOT_FOUND)
      }

      return {getReferrer}
    } catch (e) {
       throw new HttpException(e.response ? e.response : `Error in getting single referrer`, e.status ? e.status : 500);
    }
  }

}