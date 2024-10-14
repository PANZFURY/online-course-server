import { Injectable } from "@nestjs/common";
import { CreateCourseDto } from "./dto/create-course.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Course } from "./entities/course.entity";
import { Lesson } from "./lesson/entities/lesson.entity";

@Injectable()
export class CourseService {
    constructor(
        @InjectModel(Course)
        private readonly courseModel: typeof Course,
    ) {}
    async createCourse(dto: CreateCourseDto, authorId, lessons): Promise<Course> {
        if (lessons) {
            lessons = JSON.parse(lessons);
        }
        const course = await this.courseModel.create({
            ...dto,
            authorId,
            lessons
        })
            return course;
        }

    async updateCourse() {}

    async deleteCourse() {}

    async getAll() {}
    
    async getOne(courseId): Promise<Course> {
        const course = await this.courseModel.findOne({
            where: {id: courseId},
            include: [{model: Lesson, as: 'lessons'}]
        });
        return course
    }
}