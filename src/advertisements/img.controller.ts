import { Controller, Get, Header, Param, Res } from '@nestjs/common';
import { ImageService } from './image.service';

@Controller('img')
export class ImgController {
  constructor(private readonly imageRepository: ImageService) {}

  @Get('get/:imageId')
  @Header('Content-Type', 'image/jpeg')
  public async getImages(
    @Param('imageId') imageId: string,
    @Res() response: any,
  ) {
    const image = await this.imageRepository.getImageById(imageId);
    return image.pipe(response);
  }
}
