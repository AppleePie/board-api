import { Module } from '@nestjs/common';
import { AdvertisementsService } from './services/advertisements.service';
import { AdvertisementsController } from './controllers/advertisements.controller';
import { LoggerModule } from 'src/logger/logger.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Advertisement } from './entities/advertisement.entity';
import { ImageService } from './services/image.service';
import { Image } from './entities/image.entity';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { ImgController } from './controllers/img.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Advertisement, Image]),
    LoggerModule,
    NestjsFormDataModule,
  ],
  controllers: [AdvertisementsController, ImgController],
  providers: [AdvertisementsService, ImageService],
})
export class AdvertisementsModule {}
