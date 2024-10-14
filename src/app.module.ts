import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import * as dotenv from 'dotenv';
import { Dialect } from "sequelize";
import { UserModule } from "./user/user.module";
import { User } from "./user/entities/user.entity";
import { Author } from "./user/entities/author.entity";
import { FileModule } from "./file/file.module";
import { CourseModule } from "./course/course.module";
import { LessonModule } from "./course/lesson/lesson.module";
import { Course } from "./course/entities/course.entity";
import { Lesson } from "./course/lesson/entities/lesson.entity";

dotenv.config();

@Module({
    imports: [
        SequelizeModule.forRoot({
            dialect: process.env.DB_DIALECT as Dialect,
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            models: [User, Author, Course, Lesson],
            autoLoadModels: true,
            synchronize: true,
        }),
        UserModule,
        FileModule,
        CourseModule,
        LessonModule
    ],
})

export class AppModule {}