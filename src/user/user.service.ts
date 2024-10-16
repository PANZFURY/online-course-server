import { HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { Author } from "./entities/author.entity";
import { CreateAuthorDto } from "./dto/create-author.dto";
import { FileService, FileType } from "src/file/file.service";

dotenv.config();

function generateJwtForUser(userId, username): string {
    const token = jwt.sign({
        id: userId,
        username,
    }, process.env.SECRET_KEY,
    {expiresIn: '24h'}
    )
    return token;
}

function generateJwtForAuthor(authorId): string {
    const token = jwt.sign({
        authorId
    }, process.env.SECRET_KEY,
    {expiresIn: '24h'}
    )
    return token;
}

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User)
        private readonly userModel: typeof User,
        @InjectModel(Author)
        private readonly authorModel: typeof Author,
        private fileService: FileService
    ) {}

    async createUser(dto: CreateUserDto): Promise<string> {
       try{
            const hashedPassword = await bcrypt.hash(dto.password, 10);
            const user = await this.userModel.create({
                username: dto.username,
                email: dto.email,
                password: hashedPassword
            })
            const token = generateJwtForUser(user.id, user.username);
            return token;
       } catch(e) {
        throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR )
        }
    }

    async createAuthor(dto: CreateAuthorDto, picture: Express.Multer.File, userId: number): Promise<string> {
        try{
            const candidate = await this.authorModel.findOne({where: {userId}});
            if (candidate) {
                throw new UnauthorizedException('Author is already exists')
            }
            const picturePath = this.fileService.createFile(FileType.IMAGE, picture);
            const author = await this.authorModel.create({
                ...dto, 
                picture: picturePath,
                userId
            });
        
            const token = generateJwtForAuthor(author.id);
            return token;
        } catch(e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async loginUser(dto: LoginUserDto): Promise<string> {
        try{
            const user = await this.userModel.findOne({where: {email: dto.email, username: dto.username}});
            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
            const passwordMatch = await bcrypt.compare(dto.password, user.password);
            if (!passwordMatch) {
                throw new Error('Invalid password');
            }
            const token = generateJwtForUser(user.id, user.username);
            return token;
        } catch(e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    async loginAuthor(userId): Promise<string> {
        try{
            const author = await this.authorModel.findOne({where: {userId}});
            if (!author) {
                throw new UnauthorizedException('Author not found');
            }

            const token = generateJwtForAuthor(userId);
            return token;
        } catch(e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async check(): Promise<string> {
        return 'WORKINGGGG';
    }
} 
