import { AutoIncrement, Column, HasOne, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Author } from './author.entity';

@Table
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({unique: true})
  username: string;

  @Column({unique: true})
  email: string;

  @Column
  password: string;

  @HasOne(() => Author, {as: 'author'})
  author: Author

}