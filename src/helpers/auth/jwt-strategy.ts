import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { UserInfo } from 'src/helpers/user/user-info';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService,
    @InjectRepository(User)
    private UserRepo: Repository<User>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY
    });
  }

  async validate(payload: any) {
    let user = await this.UserRepo.findOne({
      where: {
        id: payload.user_id
      }
    })
    if (!user) {
      throw new HttpException(`Unauthenticated`, HttpStatus.UNAUTHORIZED )
    }
    return user;
    }
}