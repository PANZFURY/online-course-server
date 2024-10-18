import { AutoIncrement, BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Course } from 'src/course/entities/course.entity';
import { User } from 'src/user/entities/user.entity';

@Table
export class Certificate extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @ForeignKey(() => Course)
    @Column
    courseId: number;

    @BelongsTo(() => Course, {as: 'course'})
    course: Course;

    @ForeignKey(() => User)
    @Column
    userId: number;

    @Column
    picture: string;

}