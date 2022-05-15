import { randomUUID } from 'crypto';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('uuid')
  public path: string;

  public static create() {
    const image = new Image();

    image.path = randomUUID();

    return image;
  }
}
