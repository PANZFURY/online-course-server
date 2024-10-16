import { AutoIncrement, BelongsTo, Column, ForeignKey, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Author } from 'src/user/entities/author.entity';
import { Lesson } from '../lesson/entities/lesson.entity';

@Table
export class Course extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({unique: true})
  title: string;

  @Column({unique: true})
  description: string;

  @ForeignKey(() => Author)
  @Column
  authorId: number;

  @BelongsTo(() => Author)
  author: Author;

  @HasMany(() => Lesson, {as: 'lessons', foreignKey: 'courseId', onDelete: 'CASCADE'})
  lessons: Lesson[];
    
  @Column
  price: number;

  @Column({defaultValue: false})
  isPublished: boolean;

}