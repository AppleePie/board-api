import { Injectable } from '@nestjs/common';
import { Advertisement } from './entities/advertisement.entity';

@Injectable()
export class RatingCalculatorService {
  public getRating(advertisement: Advertisement) {
    return (
      advertisement.description.length / 10 +
      (advertisement.imagesLinks?.length ?? 0)
    );
  }
}
