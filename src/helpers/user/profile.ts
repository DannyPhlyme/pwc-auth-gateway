import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';


export class ProfileInfo {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ){}
  
  public async getUserProfile(user: any) {
    try {
      const getUser = this.userRepo.findOne({
        where: {
          id: user.id
        },
        relations: ['profile']
      });
      
      if (!getUser) {
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