import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Header,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFiles,
} from '@nestjs/common';
import { createReadStream } from 'fs';
import { Role } from 'src/auth/roles/role.enum';
import { Auth } from '../auth/auth.decorator';
import { Request } from '../auth/types';
import { LoggerService } from '../logger/logger.service';
import { AdvertisementsService } from './advertisements.service';
import { Advertisement } from './entities/advertisement.entity';
import { ImageService } from './image.service';
import { RatingCalculatorService } from './rating-calculator.service';

@Controller('ads')
export class AdvertisementsController {
  constructor(
    private readonly advertisementsService: AdvertisementsService,
    private readonly imageRepository: ImageService,
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
  public async addAdvertisement(
    @Req() { user }: Request,
    @Body() advertisement: Advertisement,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (
      user.login !== advertisement.ownerName &&
      user.role !== Role.Administrator
    ) {
      throw new ForbiddenException();
    }

    const createdId = await this.advertisementsService.insertAdvertisement(
      advertisement,
      files,
    );

    this.logger.info(`Created advertisement with id = ${createdId}`);
  }

  @Auth()
  @Patch('update')
  public async updateAdvertisement(
    @Req() { user }: Request,
    @Body() advertisement: Advertisement,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (
      user.login !== advertisement.ownerName &&
      user.role !== Role.Administrator
    ) {
      throw new ForbiddenException();
    }

    const updatedId = await this.advertisementsService.updateAdvertisement(
      advertisement,
      files,
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

  @Get('/img/get/{imageId}')
  @Header('Content-Type', 'image/jpeg')
  public async getImages(imageId: string, @Res() response: any) {
    const image = await this.imageRepository.getImageById(imageId);
    return createReadStream(image).pipe(response);
  }

  private getSkipAndTake(offset: string, count: string) {
    const skip = !isNaN(+offset) ? Number(offset) : undefined;
    const take = !isNaN(+offset) ? Number(count) : undefined;

    return { skip, take };
  }
}
