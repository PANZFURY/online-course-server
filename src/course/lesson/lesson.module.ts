import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { LessonService } from "./lesson.service";
import { LessonController } from "./lesson.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Lesson } from "./entities/lesson.entity";
import { FileService } from "src/file/file.service";
import { AuthMiddleware } from "src/middleware/auth.middleware";
import { Course } from "../entities/course.entity";

@Module({
    imports: [SequelizeModule.forFeature([Lesson, Course])],
    providers: [LessonService, FileService],
    controllers: [LessonController]
})
export class LessonModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
        .apply(AuthMiddleware)
        .forRoutes(LessonController)
    }
}