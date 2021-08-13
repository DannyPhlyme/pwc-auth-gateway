import { Module } from '@nestjs/common';
import { UtilitiesController } from './utilities.controller';
import { UtilitiesService } from './utilities.service';

@Module({
  imports: [],
  controllers: [UtilitiesController],
  providers: [UtilitiesService],
})
export class UtilitiesModule {}
