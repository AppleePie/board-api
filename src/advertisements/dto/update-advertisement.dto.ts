import { PartialType } from '@nestjs/mapped-types';
import { Advertisement } from '../entities/advertisement.entity';
import { CreateAdvertisementDto } from './create-advertisement.dto';

export class UpdateAdvertisementDto extends PartialType(Advertisement) {}
