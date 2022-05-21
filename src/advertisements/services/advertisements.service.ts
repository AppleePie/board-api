import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MemoryStoredFile } from 'nestjs-form-data';
import { Repository, Like } from 'typeorm';
import { Advertisement } from '../entities/advertisement.entity';
import { ImageService } from './image.service';
import { RatingCalculatorService } from './rating-calculator.service';

@Injectable()
export class AdvertisementsService {
  public constructor(
    @InjectRepository(Advertisement)
    private readonly advertisementRepository: Repository<Advertisement>,
    private readonly imageService: ImageService,
  ) {}

  public findOne(id: string) {
    return this.advertisementRepository.findOne(id);
  }

  public findById(uuid: string) {
    return this.advertisementRepository.findOne(uuid);
  }

  public findByName(ownerName: string) {
    return this.advertisementRepository.find({ where: { ownerName } });
  }

  public findRecommended(skip = 0, take = 21) {
    return this.advertisementRepository.find({ skip, take });
  }

  public async insertAdvertisement(
    advertisement: Advertisement,
    imageFiles: MemoryStoredFile[],
  ): Promise<string> {
    const images = (await this.imageService.uploadAll(imageFiles)).filter(
      (image) => image != null,
    );

    advertisement.imagesLinks = images.map(({ path }) => 'img/get/' + path);
    advertisement.imageIds = images.map(({ id }) => id);
    advertisement.rating =
      RatingCalculatorService.calculateRating(advertisement);

    const result = await this.advertisementRepository.insert(advertisement);

    const [{ id }] = result.identifiers;

    return id;
  }

  public async updateAdvertisement(
    updateAdvertisementDto: Advertisement,
    imageFiles: MemoryStoredFile[],
  ): Promise<string | null> {
    const current = await this.findOne(updateAdvertisementDto.sid);

    if (!current) return null;

    await this.imageService.deleteMany(current.imageIds);

    const images = (await this.imageService.uploadAll(imageFiles)).filter(
      (image) => image != null,
    );

    updateAdvertisementDto.imagesLinks = images.map(
      ({ path }) => 'img/get/' + path,
    );
    updateAdvertisementDto.imageIds = images.map(({ id }) => id);
    updateAdvertisementDto.rating = RatingCalculatorService.calculateRating(
      updateAdvertisementDto,
    );

    await this.advertisementRepository.update(
      current.sid,
      updateAdvertisementDto,
    );

    return current.sid;
  }

  public async delete(id: string) {
    const { affected } = await this.advertisementRepository.delete(id);

    return affected != null && affected > 0;
  }

  public getSimilar(searchText: string, skip = 0, take = 21) {
    const containsSearchText = Like(`%${searchText.toLowerCase()}%`);

    return this.advertisementRepository.find({
      skip,
      take,
      where: {
        title: containsSearchText,
        ownerName: containsSearchText,
        description: containsSearchText,
      },
    });
  }

  public getWithCategory(category: string, skip = 0, take = 21) {
    return this.advertisementRepository.find({
      skip,
      take,
      where: { category },
    });
  }
}
