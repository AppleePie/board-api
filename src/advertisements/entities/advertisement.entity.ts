import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Advertisement {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('int')
  public price: number;

  @Column()
  public ownerName: string;

  @Column()
  public title: string;

  @Column()
  public description: string;

  @Column()
  public category: string;

  @Column('int', { default: null })
  public rating: number | null;

  @Column('simple-array', { default: null })
  public imageLinks: string[] | null;

  @Column('simple-array', { default: null })
  public imageIds: string[] | null;
}
