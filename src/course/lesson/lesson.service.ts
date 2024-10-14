import { Injectable } from "@nestjs/common";
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
    async createLesson(dto: CreateLessonDto, video, authorId, courseId): Promise<Lesson> {
        const videoPath = this.fileService.createFile(FileType.VIDEO, video)
        const course = await this.courseModel.findOne({where: {id: courseId}})
        const lesson = await this.lessonModel.create({
            ...dto,
            video: videoPath,
            authorId,
            courseId: course.id
        })
        return lesson;
    }
}