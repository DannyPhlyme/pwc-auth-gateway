import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { InternalServerErrorException, NotFoundException, Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { UpdateUserDto } from '../../dtos/user/update-user.dto';
import { Profile } from 'src/entities/profile.entity';

@Injectable()
export class UserInfo {
  constructor(
    @InjectRepository(User)
    private UserRepo: Repository<User>,

    @InjectRepository(Profile)
    private ProfileRepo: Repository<Profile>
  ) { }

  public async findUsers() {
    try {
      const get_users = await this.UserRepo.find({});
      if (!get_users) {
        throw new HttpException(`users not found`, HttpStatus.NOT_FOUND);
      }

      return {
        results: get_users ,
        message: `Users fetch successful`
      }
    } catch (e) {
       throw new HttpException(e.response ? e.response :`Error in processing fetch all user`, e.status ? e.status : 500);
    }
  }

  public async singleUser(user_id: number) {
    try {
      const get_user = await this.UserRepo.findOne({
        where: {
          id: user_id
        }
      })

      if (!get_user) {
          throw new HttpException(`User Not Found`, HttpStatus.NOT_FOUND);
      }
      return {
        user: get_user,
        message: `User fetch Successfully`
      }

    } catch (e) {
      throw new HttpException(e.response ? e.response :`Error in processing fetch all user`, e.status ? e.status : 500);
    }
  }

  public async updateUser(payload: UpdateUserDto, user: any) {
    try {
      let get_user = await this.UserRepo.findOne({
        where: {
          id: user.id
        }
      })

      if (!get_user) {
        throw new NotFoundException({
          message: `User Not Found`
        })
      }

      get_user.first_name = payload.first_name;
      get_user.last_name = payload.last_name;


      let profile = await this.ProfileRepo.findOne({user: get_user})
 
      if (!profile) {
        throw new NotFoundException({
          message: `Profile Does Not Exist`,
        })
      }

      profile.phone= payload.phone
      profile.gender= payload.gender
      profile.marital_status= payload.marital_status
      profile.hobbies= payload.hobbies
      profile.occupation= payload.occupation
      profile.user = get_user;
    
      //fire an Event
      await this.UserRepo.save(get_user)

      await this.ProfileRepo.save(profile)

      return {
        results : {profile}
      }

    } catch (e) {
      throw new HttpException(e.response ? e.response : `Error in processing user registration`, e.status ? e.status : 500);
    }
  }
}