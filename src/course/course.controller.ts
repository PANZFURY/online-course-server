import { Body, Controller, Delete, Get, Patch, Post, Req, UnauthorizedException, UseInterceptors } from "@nestjs/common";
import { CourseService } from "./course.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { Course } from "./entities/course.entity";
import { UpdateCourseDto } from "./dto/update-course.dto";

@Controller('course')
export class CourseController {
    constructor(
        private readonly courseService: CourseService
    ) {}

    
    @Post('create')
    async createCourse(@Body() dto: CreateCourseDto, @Req() req: Request, lessons): Promise<Course> {
        const user = (req as any).user;
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        if (!user.authorId) {
            throw new UnauthorizedException('You are not the author')
        }
        const authorId = user.id || user.authorId;
        const course = await this.courseService.createCourse(dto, authorId, lessons);
        return course;
    }

    @Patch(':id')
    async updateCourse(@Body() dto: UpdateCourseDto, @Req() req: Request): Promise<Course> {
        const {id} = (req as any).params;
        const course = await this.courseService.updateCourse(id, dto);
        return course;
    }

    @Delete(':id')
    async deleteCourse(@Req() req: Request): Promise<number> {
        const {id} = (req as any).params;
        const course = await this.courseService.deleteCourse(id);
        return course;
    }

    async getAll() {}
    
    @Get(':id')
    async getOne(@Req() req: Request): Promise<Course> {
        const {id} = (req as any).params;
        const course = this.courseService.getOne(id);
        return course;
    }
}