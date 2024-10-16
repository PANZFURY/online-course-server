import { Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateCourseDto } from "./dto/create-course.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Course } from "./entities/course.entity";
import { Lesson } from "./lesson/entities/lesson.entity";
import { Author } from "src/user/entities/author.entity";

@Injectable()
export class CourseService {
    constructor(
        @InjectModel(Course)
        private readonly courseModel: typeof Course,
    ) {}
    async createCourse(dto: CreateCourseDto, authorId: number, lessons: string): Promise<Course> {
        const course = await this.courseModel.create({
            ...dto,
            authorId,
            lessons
        })
            return course;
        }

    async updateCourse(courseId: number, updateData: Partial<Course>): Promise<Course> {
        const [affectedCount, affectedRows] = await this.courseModel.update(updateData, {
            where: {id: courseId},
            returning: true,
        });
        
        if (affectedCount === 0) {
            throw new UnauthorizedException('Coures was not found or incorrect data')
        }
    
        return affectedRows[0];
    }

    async deleteCourse(courseId: number): Promise<number> {
        const course = await this.courseModel.destroy({where: {id: courseId}});
        return course;
    }

    async getAll() {}
    
    async getOne(courseId: number): Promise<Course> {
        const course = await this.courseModel.findOne({
            where: {id: courseId},
            include: [{model: Lesson, as: 'lessons'}, {model: Author, as: 'author'}]
        });
        return course
    }
}