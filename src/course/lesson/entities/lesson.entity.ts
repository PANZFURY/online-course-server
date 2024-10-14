import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Course } from "src/course/entities/course.entity";
import { Author } from "src/user/entities/author.entity";

@Table
export class Lesson extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @ForeignKey(() => Author)
    authorId: number;

    @ForeignKey(() => Course)
    courseId: number;

    @BelongsTo(() => Course, {foreignKey: 'courseId', as: 'course'})
    course: Course;

    @Column
    title: string;

    @Column
    content: string;

    @Column
    video: string;
    
}