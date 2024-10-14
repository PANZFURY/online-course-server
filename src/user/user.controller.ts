import { Body, Controller, Get, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserService } from "./user.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { Request } from "express";
import { AuthGuard } from "src/guards/auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateAuthorDto } from "./dto/create-author.dto";
import { Author } from "./entities/author.entity";

@Controller('user')
export class UserController{
    constructor(private readonly userService: UserService) {}
    
    @Post('registration')
    async createUser(@Body() dto: CreateUserDto): Promise<string> {
        return this.userService.createUser(dto);
    }

    @UseGuards(AuthGuard)
    @Post('author')
    @UseInterceptors(FileInterceptor('picture'))
    async createAuthor(@UploadedFile() file: Express.Multer.File, @Body() dto: CreateAuthorDto, @Req() request: Request): Promise<Author> {
        const userId = (request as any).user.id;
        const author = this.userService.createAuthor(dto, file, userId);
        return author;
    }
    
    @Post('login')
    async login(@Body() dto: LoginUserDto): Promise<string> {
        return this.userService.login(dto)
    }

    @UseGuards(AuthGuard)
    @Get()
    async check(@Req() req: Request): Promise<string> {
        return this.userService.check();
    }
}