import { Body, Controller, Get, Post, Req, UnauthorizedException, UseInterceptors } from "@nestjs/common";
import { CourseService } from "./course.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { Course } from "./entities/course.entity";

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
        const authorId = user.id;
        const course = await this.courseService.createCourse(dto, authorId, lessons);
        return course;
    }

    async updateCourse() {}

    async deleteCourse() {}

    async getAll() {}
    
    @Get(':id')
    async getOne(@Req() req: Request): Promise<Course> {
        const {id} = (req as any).params;
        const course = this.courseService.getOne(id);
        return course;
    }
}