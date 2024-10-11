import { AutoIncrement, Column, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { User } from './user.entity';

@Table
export class Author extends Model {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @Column
  bio: string;

  @Column
  picture: string;

}