import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';
import { Role } from 'src/auth/roles/role.enum';
import { Auth } from '../../auth/auth.decorator';
import { Request, FormData } from '../types';
import { LoggerService } from '../../logger/logger.service';
import { AdvertisementsService } from '../services/advertisements.service';
import { Advertisement } from '../entities/advertisement.entity';
import { RatingCalculatorService } from '../services/rating-calculator.service';

@Controller('ads')
export class AdvertisementsController {
  constructor(
    private readonly advertisementsService: AdvertisementsService,
    private readonly ratingCalculator: RatingCalculatorService,
    @Inject(LoggerService.diKey) private readonly logger: LoggerService,
  ) {}

  @Get('get')
  public getRecommended(
    @Query('offset') offset: string,
    @Query('count') count: string,
  ) {
    const { skip, take } = this.getSkipAndTake(offset, count);

    return this.advertisementsService.findRecommended(skip, take);
  }

  @Get('search')
  public search(
    @Query('query') query: string,
    @Query('offset') offset: string,
    @Query('count') count: string,
  ) {
    const { skip, take } = this.getSkipAndTake(offset, count);

    return this.advertisementsService.getSimilar(query, skip, take);
  }

  @Get('categories')
  public getCategories(
    @Query('category') category: string,
    @Query('offset') offset: string,
    @Query('count') count: string,
  ) {
    const { skip, take } = this.getSkipAndTake(offset, count);

    return this.advertisementsService.getWithCategory(category, skip, take);
  }

  @Auth()
  @Get('getUserAds')
  public getUserAdvertisements(@Req() { user }: Request) {
    return this.advertisementsService.findByName(user.name);
  }

  @Auth()
  @Post('add')
  @FormDataRequest()
  public async addAdvertisement(@Req() req: any) {
    const { user, body } = req;
    const { advertisement, images } = this.parseFormBody(body);

    if (
      user.name !== advertisement.ownerName &&
      user.role !== Role.Administrator
    ) {
      throw new ForbiddenException();
    }

    const createdId = await this.advertisementsService.insertAdvertisement(
      advertisement,
      images,
    );

    this.logger.info(`Created advertisement with id = ${createdId}`);
  }

  @Auth()
  @Patch('update')
  @FormDataRequest()
  public async updateAdvertisement(@Req() req: Request) {
    const { user, body } = req;
    const { advertisement, images } = this.parseFormBody(body);
    if (
      user.name !== advertisement.ownerName &&
      user.role !== Role.Administrator
    ) {
      throw new ForbiddenException();
    }

    const updatedId = await this.advertisementsService.updateAdvertisement(
      advertisement,
      images,
    );

    this.logger.info(`Updated advertisement with id = ${updatedId}`);
  }

  @Auth()
  @Delete(':id/delete')
  public async deleteAdvertisement(
    @Req() { user }: Request,
    @Param('id') id: string,
  ) {
    const advertisement = await this.advertisementsService.findOne(id);

    if (
      user.login !== advertisement.ownerName &&
      user.role !== Role.Administrator
    ) {
      throw new ForbiddenException();
    }

    await this.advertisementsService.delete(id);

    this.logger.info(`Delete advertisement with id = ${id}`);
  }

  private getSkipAndTake(offset: string, count: string) {
    const skip = !isNaN(+offset) ? Number(offset) : undefined;
    const take = !isNaN(+offset) ? Number(count) : undefined;

    return { skip, take };
  }

  // TODO: убрать ручной парсинг форм-даты
  private parseFormBody(body: FormData) {
    const { Ad, ...imagesFiles } = body;
    const source = JSON.parse(Ad);

    const advertisement = new Advertisement();
    Object.keys(source).forEach((key) => {
      const field = key[0].toLowerCase() + key.substring(1);
      const value = source[key];

      if (value) advertisement[field] = value;
    });
    const images = Object.keys(imagesFiles).map((key) => imagesFiles[key]);

    return { advertisement, images };
  }
}
