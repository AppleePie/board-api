import { MemoryStoredFile } from 'nestjs-form-data';
import { Advertisement } from '../entities/advertisement.entity';

// TODO: перейти на эту dto-модель
export class AdvertisementWithImagesDto {
  ad: Advertisement;
  images: MemoryStoredFile[];
}
