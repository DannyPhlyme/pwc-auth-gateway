import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ChangeEmail } from '../helpers/user/change-email';
import { ChangePassword } from '../helpers/user/change-password';
import { UserInfo } from 'src/helpers/user/user-info';
import { User } from '../entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Password } from '../entities/password.entity';
import { LoginHistory } from '../entities/login-history.entity';
import { Token } from '../entities/token.entity';
import { Profile } from '../entities/profile.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../helpers/auth/jwt-strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [UserController],
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '1d' },
    }),
     TypeOrmModule.forFeature([
      User,
      Token,
      Password,
      LoginHistory,
      Profile,
    ]),
  ],
  providers: [
    JwtStrategy,
    UserService,
    ChangeEmail,
    ChangePassword,
    UserInfo,
    ConfigService
  ]
})
export class UserModule {}
