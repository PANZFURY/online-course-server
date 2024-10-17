import { AutoIncrement, BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Course } from 'src/course/entities/course.entity';
import { User } from 'src/user/entities/user.entity';

@Table
export class Forum extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @ForeignKey(() => User)
    @Column
    userId: number;

    @BelongsTo(() => Course, {foreignKey: 'courseId', as: 'course'})
    course: Course;

    @BelongsTo(() => User, {as: 'user'})
    user: User

    @Column
    message: string;
}
