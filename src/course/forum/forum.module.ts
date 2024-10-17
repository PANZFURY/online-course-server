import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ForumController } from "./forum.controller";
import { ForumService } from "./forum.service";
import { AuthMiddleware } from "src/middleware/auth.middleware";
import { SequelizeModule } from "@nestjs/sequelize";
import { Forum } from "./entities/forum.entity";
import { User } from "src/user/entities/user.entity";
import { Course } from "../entities/course.entity";

@Module({
    imports: [SequelizeModule.forFeature([Forum, User, Course])],
    controllers: [ForumController],
    providers: [ForumService]
})
export class ForumModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
        .apply(AuthMiddleware)
        .forRoutes(ForumController)
    }
}