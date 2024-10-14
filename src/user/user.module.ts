import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./entities/user.entity";
import { Author } from "./entities/author.entity";
import { FileService } from "src/file/file.service";

@Module({
    controllers: [UserController],
    providers: [UserService, FileService],
    imports: [
        SequelizeModule.forFeature([User, Author]), 
    ]
})

export class UserModule {};
