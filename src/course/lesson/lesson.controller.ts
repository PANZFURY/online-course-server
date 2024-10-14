import { Body, Controller, Post, Req, UnauthorizedException, UploadedFile, UseInterceptors } from "@nestjs/common";
import { LessonService } from "./lesson.service";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { Lesson } from "./entities/lesson.entity";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('course/lesson')
export class LessonController{
    constructor(
        private readonly lessonService: LessonService,
    ) {}

    @Post(':courseId/create')
    @UseInterceptors(FileInterceptor('video'))
    async createLesson(@UploadedFile() file: Express.Multer.File, @Body() dto: CreateLessonDto, @Req() req: Request): Promise<Lesson> {
        const {courseId} = (req as any).params;
        const user = (req as any).user;
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        const authorId = user.id;
        const lesson = await this.lessonService.createLesson(
            dto,
            file,
            authorId,
            courseId
        )
        return lesson;
    }
}