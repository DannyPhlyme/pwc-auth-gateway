import { Module, NestMiddleware, MiddlewareConsumer, RequestMethod, NestModule } from '@nestjs/common';
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
import { AuthMiddleware} from 'src/middleware/auth.middleware';
import { Role } from 'src/entities/role.entity';
import { Permission } from 'src/entities/permission.entity';
import { AuthUtils } from '../utilities/auth';
import { AdminMiddleware } from 'src/middleware/admin.middleware';
import { UserReferrer } from '../helpers/user/referrer';
import { Formatter } from 'src/utilities/Formatter';

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
      Role,
      Permission
    ]),
  ],
  providers: [
    JwtStrategy,
    UserService,
    ChangeEmail,
    ChangePassword,
    UserInfo,
    ConfigService,
    AuthUtils,
    UserReferrer,
    Formatter
  ]
})
export class UserModule implements NestModule {
  async configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AdminMiddleware)
      .exclude(
        'api/v1/user/single-user/:user_id',
        '/api/v1/user/update-profile',
        '/api/v1/user/profile',
        '/api/v1/user/change-email',
        '/api/v1/user/change-password',
        '/api/v1/user/user-referrer',
        '/api/v1/user/single-referrer/:user_id',
      )
       .forRoutes(UserController)
  }
}
