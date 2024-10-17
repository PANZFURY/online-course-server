import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Forum } from "./entities/forum.entity";
import { CreateForumDto } from "./dto/create-forum.dto";
import { User } from "src/user/entities/user.entity";
import { Course } from "../entities/course.entity";
import { UpdateForumDto } from "./dto/update-forum.dto";

@Injectable()
export class ForumService {
    constructor(
        @InjectModel(Forum)
        private readonly forumModel: typeof Forum,
        @InjectModel(User)
        private readonly userModel: typeof User,
        @InjectModel(Course)
        private readonly courseModel: typeof Course
    ) {}

    async createForum(dto: CreateForumDto, userId: number, courseId: number): Promise<Forum> {
        try {
            const user = await this.userModel.findOne({where: {id: userId}});
            if (!user) {
                throw new BadRequestException('User was not found');
            }
            const course = await this.courseModel.findOne({where: {id: courseId}});
            if (!course) {
                throw new BadRequestException('Course was not found');
            }
            const forum = await this.forumModel.create({
                ...dto,
                courseId,
                userId,
            })
            return forum;
        } catch(e) {
            console.log(e);
            throw new BadRequestException('Failed to create forum');
        }
    }

    async updateForum(forumId: number, updateData: Partial<Forum>): Promise<Forum> {
       try{
            const [affectedCount, affectedRows] = await this.forumModel.update(updateData, {
                where: {id: forumId},
                returning: true,
            })
            if (affectedCount === 0) {
                throw new BadRequestException('Forum was not found or incorrect data');
            }
            if(!affectedRows[0]) {
                throw new InternalServerErrorException('Failed to update forum');
                
            }
            return affectedRows[0];
       } catch(e) {
        console.log(e);
        throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
       }
    }

    async deleteForum(forumId: number): Promise<Forum> {
        try{
            const forum = await this.forumModel.findOne({where: {id: forumId}});
            if (!forum) {
                throw new BadRequestException('Forum was not found');
            }
            await forum.destroy();
            return forum;
        } catch(e) {
            console.log(e);
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    async getAll(): Promise<any> {
        try {
            const forums = await this.forumModel.findAll();
            return forums;
        } catch(e) {
            console.log(e);
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getOne(forumId: number): Promise<Forum> {
        try {
            const forum = await this.forumModel.findOne({
                where: {id: forumId},
                include: [{model: User, as: 'user'}, {model: Course, as: 'course'}]
            });
            return forum;
        } catch(e) {
            console.log(e);
            throw new BadRequestException('Forum was not found');
        }
    }
}