import { AutoIncrement, Column, HasMany, HasOne, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Author } from './author.entity';
import { Forum } from 'src/course/forum/entities/forum.entity';

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
  author: Author;

  @HasMany(() => Forum, {as: 'forum'})
  forum: Forum[];

}