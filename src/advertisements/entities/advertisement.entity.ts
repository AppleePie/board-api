import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Advertisement {
  @PrimaryGeneratedColumn('uuid')
  public sid: string;

  @Column()
  public ownerName: string;

  @Column()
  public title: string;

  @Column()
  public description: string;

  @Column()
  public category: string;

  @Column('int')
  public price: number;

  @Column('int', { nullable: true, default: null })
  public rating: number;

  @Column('simple-array', { nullable: true, default: null })
  public imagesLinks: string[] | null;

  @Column('simple-array', { nullable: true, default: null })
  public imageIds: string[] | null;
}
