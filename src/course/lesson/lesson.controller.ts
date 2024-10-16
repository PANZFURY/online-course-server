import { Body, Controller, Delete, Patch, Post, Req, UnauthorizedException, UploadedFile, UseInterceptors } from "@nestjs/common";
import { LessonService } from "./lesson.service";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { Lesson } from "./entities/lesson.entity";
import { FileInterceptor } from "@nestjs/platform-express";
import { UpdateCourseDto } from "../dto/update-course.dto";

@Controller('course/lesson')
export class LessonController{
    constructor(
        private readonly lessonService: LessonService,
    ) {}

    @Post('/create')
    @UseInterceptors(FileInterceptor('video'))
    async createLesson(@UploadedFile() file: Express.Multer.File, @Body() dto: CreateLessonDto, @Req() req: Request): Promise<Lesson> {
        const {courseId} = (req as any).query;
        const user = (req as any).user;
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        const authorId = user.authorId;
        if (!authorId) {
            throw new UnauthorizedException('You are not the author')
        }
        const lesson = await this.lessonService.createLesson(
            dto,
            file,
            authorId,
            courseId
        )
        return lesson;
    }

    @Patch(':id')
    async updateLesson(@Body() dto: UpdateCourseDto, @Req() req: Request): Promise<Lesson> {
        const {id} = (req as any).params;
        const lesson = await this.lessonService.updateLesson(id, dto);
        return lesson;
    }

    @Delete(':id')
    async deleteLesson(@Req() req: Request): Promise<number> {
        const {id} = (req as any).params;
        const lesson = await this.lessonService.deleteLesson(id);
        return lesson;
    }

}