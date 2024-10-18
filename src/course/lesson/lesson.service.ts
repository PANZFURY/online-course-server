import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Lesson } from "./entities/lesson.entity";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { FileService, FileType } from "src/file/file.service";
import { Course } from "../entities/course.entity";

@Injectable()
export class LessonService{
    constructor(
        @InjectModel(Lesson)
        private readonly lessonModel: typeof Lesson,
        @InjectModel(Course)
        private readonly courseModel: typeof Course,
        private fileService: FileService
    ) {}
    async createLesson(dto: CreateLessonDto, video: Express.Multer.File, authorId: number, courseId: number): Promise<Lesson> {
        try{
            const videoPath = this.fileService.createFile(FileType.VIDEO, video);
            if (!videoPath) {
                throw new InternalServerErrorException('Failed to upload file')
            }
            const course = await this.courseModel.findOne({where: {id: courseId}})
            if (!course) {
                throw new BadRequestException('Course was not found');
            }
            const lesson = await this.lessonModel.create({
                ...dto,
                video: videoPath,
                authorId,
                courseId: course.id
            })
            return lesson;
         } catch(e) {
        throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
     }

    async updateLesson(lessonId: number, updateData: Partial<Lesson>): Promise<Lesson> {
        const [affectedCount, affectedRows] = await this.lessonModel.update(updateData, {
            where: {id: lessonId},
            returning: true
        });
        if (!affectedCount) {
            throw new UnauthorizedException('Lesson was not found or incorrect data');
        }
        
        return affectedRows[0];
    }

    async deleteLesson(lessonId: number): Promise<number> {
        const lesson = await this.lessonModel.destroy({where: {id: lessonId}});
        return lesson;
    }
}