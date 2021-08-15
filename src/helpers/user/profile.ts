import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';


export class ProfileInfo {
  constructor(
    @InjectRepository(User)
    private UserRepo: Repository<User>,
  ){}
  
  public async getUserProfile(user: any) {
    try {
      const get_user = this.UserRepo.findOne({
        where: {
          id: user.id
        },
        relations: ['profile']
      });
      
      if (!get_user) {
        throw new NotFoundException({
          message: `User Not Found`
        })
      }

      return {
        statusCode: 200,
        message: `Profile fetch Successful`
      }
     } catch (e) {
      throw new InternalServerErrorException({
        error: e,
        message: `Error in processing fetch profile`
      })
    }
  }
}