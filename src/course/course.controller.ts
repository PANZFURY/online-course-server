import { BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, Patch, Post, Req, UnauthorizedException, UseInterceptors } from "@nestjs/common";
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
        try{
            const {id} = (req as any).params;
            if (!id) {
                throw new BadRequestException('Incorrect id');
            }
            const course = await this.courseService.updateCourse(id, dto);
            return course;
        } catch(e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    async deleteCourse(@Req() req: Request): Promise<number> {
        try {
            const {id} = (req as any).params;
            if (!id) {
                throw new BadRequestException('Incorrect id');
            }
            const course = await this.courseService.deleteCourse(id);
            return course;
        } catch(e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getAll(): Promise<any> {
        try{
            const courses = await this.courseService.getAll();
            return courses;
        } catch(e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @Get(':id')
    async getOne(@Req() req: Request): Promise<Course> {
        try{
             const {id} = (req as any).params;
             if (!id) {
                throw new BadRequestException('Incorrect id');
             }
            const course = this.courseService.getOne(id);
            return course;
        } catch(e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}