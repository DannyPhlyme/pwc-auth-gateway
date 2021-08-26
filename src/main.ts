import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
<<<<<<< HEAD
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.REDIS,
      options: {
        url: 'redis://localhost:6379',
        retryAttempts: 5,
        retryDelay: 5000,
      },
    });
  app.listen();
=======
import {} from 'typeorm'
import { ValidationPipe } from './utilities/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

    await app.listen(3000);
>>>>>>> 5665fef976d7613c6803eeab7e35bc014a4eef61
}
bootstrap();
