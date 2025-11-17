import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [RatingService],
  exports: [RatingService],
})
export class RatingModule {}
