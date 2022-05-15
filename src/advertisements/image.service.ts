import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Image } from './entities/image.entity';
import * as fs from 'fs';
import path from 'path';

@Injectable()
export class ImageService {
  private readonly imageDirectory: string;

  public constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {
    this.imageDirectory = __dirname + '-' + process.env.IMAGES_DIRECTORY;
    if (!fs.existsSync(this.imageDirectory)) fs.mkdirSync(this.imageDirectory);
  }

  public async getImageById(id: string) {
    const image = await this.imageRepository.findOne(id);

    return fs.promises.readFile(path.join(this.imageDirectory, image.path));
  }

  public async upload(imageFile: Express.Multer.File): Promise<Image | null> {
    const image = Image.create();

    const result = await this.imageRepository.insert(image);

    const [{ id }] = result.identifiers;

    try {
      await fs.promises.writeFile(
        path.join(this.imageDirectory, image.path),
        imageFile.buffer,
      );

      return image;
    } catch {
      await this.imageRepository.delete(id);

      return null;
    }
  }

  public uploadAll(imageFiles: Express.Multer.File[]) {
    return Promise.all(imageFiles.map((image) => this.upload(image)));
  }

  public async deleteMany(imageIds: string[]) {
    const images = await this.imageRepository.find({ where: In(imageIds) });

    return Promise.all(images.map(({ path }) => fs.promises.rm(path)));
  }
}
