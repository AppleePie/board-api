import { PartialType } from '@nestjs/mapped-types';
import { Advertisement } from '../entities/advertisement.entity';

export class UpdateAdvertisementDto extends PartialType(Advertisement) {}
