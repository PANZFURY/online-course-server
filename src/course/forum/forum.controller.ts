import { BadRequestException, Body, Controller, Delete, Get, HttpException, Patch, Post, Query, Req, UnauthorizedException } from "@nestjs/common";
import { ForumService } from "./forum.service";
import { CreateForumDto } from "./dto/create-forum.dto";
import { Forum } from "./entities/forum.entity";
import { UpdateForumDto } from "./dto/update-forum.dto";

@Controller('course/forum')
export class ForumController {
    constructor(
        private readonly forumService: ForumService,
    ) {}

    @Post('create')
    async createForum(@Body() dto: CreateForumDto, @Req() req: Request): Promise<Forum> {
        const user = (req as any).user;
        if (!user) {
            throw new UnauthorizedException('User is not authorized');
        }
        const userId = user.id;
        if (!userId) {
            throw new UnauthorizedException('User is not authorized');
        }
        const courseId = (req as any).query.courseId;
        if (!courseId) {
            throw new BadRequestException('Indicate the course');
        }
        const course = await this.forumService.createForum(dto, userId, courseId);
        return course;
    }

    @Patch('update')
    async updateForum(@Body() dto: UpdateForumDto, @Req() req: Request): Promise<Forum> {
        const {forumId} = (req as any).query;
        if (!forumId) {
            throw new BadRequestException('Incorrect ID of forum');
        }
        const forum = await this.forumService.updateForum(forumId, dto)
        return forum;
    }

    @Delete('delete/:id')
    async deleteForum(@Req() req: Request): Promise<Forum> {
        const {id} = (req as any).params;
        if (!id) {
            throw new BadRequestException('Incorrect ID');
        }
        const forum = await this.forumService.deleteForum(id);
        return forum;
    }
    
    @Get()
    async getAll(): Promise<any> {
        const forums = await this.forumService.getAll();
        return forums;
    }

    @Get(':id')
    async getOne(@Req() req: Request): Promise<Forum> {
        const {id} = (req as any).params;
        if (!id) {
            throw new BadRequestException('Incorrect ID');
        }
        const forum = await this.forumService.getOne(id);
        return forum;
    }
}