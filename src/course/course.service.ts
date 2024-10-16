import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
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
        try{
            const course = await this.courseModel.create({
                ...dto,
                authorId,
                lessons
            })
            return course;
        } catch(e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }

    async updateCourse(courseId: number, updateData: Partial<Course>): Promise<Course> {
        try{
            const [affectedCount, affectedRows] = await this.courseModel.update(updateData, {
                where: {id: courseId},
                returning: true,
            });
        
            if (affectedCount === 0) {
            throw new UnauthorizedException('Course was not found or incorrect data')
            }

            if (!affectedRows[0]) {
                throw new UnauthorizedException('Failed to update course')
            }
    
            return affectedRows[0];
        } catch(e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async deleteCourse(courseId: number): Promise<number> {
        try {
            const course = await this.courseModel.destroy({where: {id: courseId}});
            return course;
        } catch(e) {
            throw new UnauthorizedException('Failed to delte course');
        }
    }

    async getAll(): Promise<any> {
        try{
            const courses = await this.courseModel.findAll();
            return courses;
        } catch(e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    async getOne(courseId: number): Promise<Course> {
        try{ 
            const course = await this.courseModel.findOne({
                where: {id: courseId},
                include: [{model: Lesson, as: 'lessons'}, {model: Author, as: 'author'}]
            });
            return course;
        } catch(e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}