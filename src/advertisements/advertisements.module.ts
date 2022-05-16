import { Module } from '@nestjs/common';
import { AdvertisementsService } from './advertisements.service';
import { AdvertisementsController } from './advertisements.controller';
import { LoggerModule } from 'src/logger/logger.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Advertisement } from './entities/advertisement.entity';
import { ImageService } from './image.service';
import { Image } from './entities/image.entity';
import { RatingCalculatorService } from './rating-calculator.service';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [
    TypeOrmModule.forFeature([Advertisement, Image]),
    LoggerModule,
    NestjsFormDataModule,
  ],
  controllers: [AdvertisementsController],
  providers: [AdvertisementsService, ImageService, RatingCalculatorService],
})
export class AdvertisementsModule {}
