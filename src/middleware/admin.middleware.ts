import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/entities/permission.entity';
import { Role } from 'src/entities/role.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import {Request, Response, NextFunction} from 'express'
import { AuthUtils } from 'src/utilities/auth';
import { Roles } from 'src/entities/enum';


@Injectable()
export class AdminMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    
    private authUtils: AuthUtils
  ){}
  async use(req: Request, res: Response, next: Function) {
    try {
       const header = req.headers.authorization;
      if(!header){
        throw new HttpException(`No Bearer token`, HttpStatus.UNAUTHORIZED)
      }

      const token = header.split(' ')[1];

       if(!token){
        throw new HttpException(`Invalid Bearer Token`, HttpStatus.UNAUTHORIZED)
      }
    
      const decoded = await this.authUtils.decodeToken(token)

      const user = await this.userRepo.findOne({
        where: {
          id: decoded.user_id
        },
        relations: ['role']
      });

      if (user.role.name !== Roles.ADMIN) {
         throw new HttpException(`User has Unauthorized Access`, HttpStatus.UNAUTHORIZED)
      }
      
      next();
    } catch (e) {
       throw new HttpException(e.response ? e.response : e.message, e.status ? e.status : 500);
    }
    
  }
}
