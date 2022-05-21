import { Advertisement } from '../entities/advertisement.entity';

export class RatingCalculatorService {
  public static calculateRating(advertisement: Advertisement) {
    return Math.ceil(
      advertisement.description.length / 10 +
        (advertisement.imagesLinks?.length ?? 0),
    );
  }
}
