import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserService } from "./user.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { Request } from "express";
import { AuthGuard } from "src/guards/auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateAuthorDto } from "./dto/create-author.dto";

@Controller('user')
export class UserController{
    constructor(private readonly userService: UserService) {}
    
    @Post('registration')
    async createUser(@Body() dto: CreateUserDto): Promise<string> {
        try{ 
            const user = await this.userService.createUser(dto)
            return user;
        } catch(e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(AuthGuard)
    @Post('author/create')
    @UseInterceptors(FileInterceptor('picture'))
    async createAuthor(@UploadedFile() file: Express.Multer.File, @Body() dto: CreateAuthorDto, @Req() request: Request): Promise<string> {
        try{
            const userId = (request as any).user.id;
            const author = await this.userService.createAuthor(dto, file, userId);
            return author;
        } catch(e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    
    @Post('login')
    async loginUser(@Body() dto: LoginUserDto): Promise<string> {
        try{
            const user = this.userService.loginUser(dto);
            return user;
        } catch(e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(AuthGuard)
    @Post('author/login')
    async loginAuthor(@Req() req: Request): Promise<string> {
       try{
            const user = (req as any).user;
            if (!user) {
                throw new UnauthorizedException('You are not authorized');
            }
            const userId = user.id;
            const token = this.userService.loginAuthor(userId);
            return token; 
        } catch(e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @UseGuards(AuthGuard)
    @Get()
    async check(@Req() req: Request): Promise<string> {
        return this.userService.check();
    }
}