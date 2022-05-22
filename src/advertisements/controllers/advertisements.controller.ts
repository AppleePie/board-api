import {
  BadRequestException,
  Body,
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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Role } from 'src/auth/roles/role.enum';
import { Auth } from '../../auth/auth.decorator';
import { Request, FormData } from '../types';
import { LoggerService } from '../../logger/logger.service';
import { AdvertisementsService } from '../services/advertisements.service';
import { Advertisement } from '../entities/advertisement.entity';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('ads')
export class AdvertisementsController {
  constructor(
    private readonly advertisementsService: AdvertisementsService,
    @Inject(LoggerService.diKey) private readonly logger: LoggerService,
  ) {}

  @Get('get')
  public getRecommended(
    @Query('offset') offset: string,
    @Query('count') count: string,
  ) {
    const { skip, take } = AdvertisementsController.getSkipAndTake(
      offset,
      count,
    );

    return this.advertisementsService.findRecommended(skip, take);
  }

  @Get('search')
  public search(
    @Query('query') query: string,
    @Query('offset') offset: string,
    @Query('count') count: string,
  ) {
    const { skip, take } = AdvertisementsController.getSkipAndTake(
      offset,
      count,
    );

    return this.advertisementsService.getSimilar(query, skip, take);
  }

  @Get('categories')
  public getCategories(
    @Query('category') category: string,
    @Query('offset') offset: string,
    @Query('count') count: string,
  ) {
    const { skip, take } = AdvertisementsController.getSkipAndTake(
      offset,
      count,
    );

    return this.advertisementsService.getWithCategory(category, skip, take);
  }

  @Get('getById/:id')
  public getById(@Param('id') id: string) {
    this.logger.info(`Get by id = ${id}`);

    return this.advertisementsService.findById(id);
  }

  @Auth()
  @Get('getUserAds')
  public getUserAdvertisements(@Req() { user }: Request) {
    return this.advertisementsService.findByName(user.name);
  }

  @Auth()
  @Post('add')
  @UseInterceptors(AnyFilesInterceptor())
  public async addAdvertisement(
    @Req() { user }: Request,
    @UploadedFiles() images,
    @Body() body: any,
  ) {
    const advertisement = AdvertisementsController.parseAdvertisement(body);

    if (!advertisement) {
      throw new BadRequestException('missing advertisement');
    }

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
  @UseInterceptors(AnyFilesInterceptor())
  public async updateAdvertisement(
    @Req() { user }: Request,
    @UploadedFiles() images,
    @Body() body: any,
  ) {
    const advertisement = AdvertisementsController.parseAdvertisement(body);

    if (!advertisement) {
      throw new BadRequestException('missing advertisement');
    }

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

  private static getSkipAndTake(offset: string, count: string) {
    const skip = !isNaN(+offset) ? Number(offset) : undefined;
    const take = !isNaN(+offset) ? Number(count) : undefined;

    return { skip, take };
  }

  private static parseAdvertisement(body: FormData) {
    const { ad, Ad } = body;
    if (!ad && !Ad) {
      return null;
    }

    const source = JSON.parse(ad ?? Ad);

    const advertisement = new Advertisement();
    Object.keys(source).forEach((key) => {
      const field = key[0].toLowerCase() + key.substring(1);
      const value = source[key];

      if (value) advertisement[field] = value;
    });

    return advertisement;
  }
}
