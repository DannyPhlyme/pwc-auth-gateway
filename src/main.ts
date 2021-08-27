import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {} from 'typeorm'
import { ValidationPipe } from './utilities/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
