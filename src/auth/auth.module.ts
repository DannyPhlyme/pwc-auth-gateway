import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/Typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/helpers/auth/jwt-strategy';
import { Registration } from 'src/helpers/auth/registration';
import { Login } from 'src/helpers/auth/login';
import { ForgotPassword } from '../helpers/auth/forget-password';
import { ResendVerificationToken } from 'src/helpers/auth/resend-verification-token';
import { VerifyEmail } from 'src/helpers/auth/verify-email';
import { ReferralCredential } from 'src/helpers/auth/referral-credentials';
import { ResetPassword } from 'src/helpers/auth/reset-password';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { Token } from 'src/entities/token.entity';
import { Password } from 'src/entities/password.entity';
import { LoginHistory } from 'src/entities/login-history.entity';
import { Profile } from 'src/entities/profile.entity';
import { AuthUtils } from '../utilities/auth';
import { Formatter } from 'src/utilities/Formatter';
import { ConfigModule } from '@nestjs/config';
import { UserInfo } from 'src/helpers/user/user-info';
import { UserModule } from '../user/user.module';
import { UtilitiesService } from '../utilities/utilities.service';

@Module({
  imports: [
  UserModule,
  PassportModule,
    ConfigModule.forRoot(),
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
    AuthService,
    JwtStrategy,
    Registration,
    Login,
    ForgotPassword,
    ResendVerificationToken,
    VerifyEmail,
    ReferralCredential,
    ResetPassword,
    AuthUtils,
    Formatter,
    UtilitiesService,
    UserInfo
  ],
  controllers: [AuthController],
})
export class AuthModule {}
