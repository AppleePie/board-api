import { Role } from '../../roles/role.enum';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public name: string;

  @Column()
  public login: string;

  @Column()
  public password: string;

  @Column()
  public role: Role | null;
}
