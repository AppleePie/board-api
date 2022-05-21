import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Image } from '../entities/image.entity';
import * as fs from 'fs';
import { MemoryStoredFile } from 'nestjs-form-data';
import * as path from 'path';

@Injectable()
export class ImageService {
  private readonly imageDirectory: string;

  public constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {
    const __root = path.dirname(require.main.filename);
    this.imageDirectory = path.join(__root, process.env.IMAGES_DIRECTORY);
    if (!fs.existsSync(this.imageDirectory)) fs.mkdirSync(this.imageDirectory);
  }

  public async getImageById(id: string) {
    const image = await this.imageRepository.findOne({ path: id });

    console.log(image);

    return fs.createReadStream(path.join(this.imageDirectory, image.path));
  }

  public async upload(imageFile: MemoryStoredFile): Promise<Image | null> {
    const image = Image.create();

    await this.imageRepository.insert(image);

    await fs.promises.writeFile(
      path.join(this.imageDirectory, image.path),
      imageFile.buffer,
    );

    return image;
  }

  public uploadAll(imageFiles: MemoryStoredFile[]) {
    return Promise.all(imageFiles.map((image) => this.upload(image)));
  }

  public async deleteMany(imageIds: string[]) {
    const images = await this.imageRepository.find({ where: In(imageIds) });

    return Promise.all(images.map(({ path }) => fs.promises.rm(path)));
  }
}
