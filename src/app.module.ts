import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilitiesModule } from './utilities/utilities.module';

@Module({
  imports: [
    UserModule, AuthModule, UtilitiesModule, ConfigModule.forRoot(),
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB,
        ssl: {
          rejectUnauthorized: false,
        },
        // options: {"trustServerCertificate": true},
        entities: ['dist/entities/*.entity{.ts,.js}'],
        migrations: ['migrations/*{.ts,.js}'],
        synchronize: true,
      }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
 
