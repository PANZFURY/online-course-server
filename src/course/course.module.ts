import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { CourseController } from "./course.controller";
import { CourseService } from "./course.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Course } from "./entities/course.entity";
import { Lesson } from "./lesson/entities/lesson.entity";
import { AuthMiddleware } from "src/middleware/auth.middleware";

@Module({
    imports: [SequelizeModule.forFeature([Course, Lesson])],
    providers: [CourseService],
    controllers: [CourseController]

})
export class CourseModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer
        .apply(AuthMiddleware)
        .forRoutes(CourseController)

    }
}