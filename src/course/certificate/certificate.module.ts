import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Certificate } from "./entities/certificate.entity";
import { User } from "src/user/entities/user.entity";
import { Course } from "../entities/course.entity";
import { CertificateController } from "./certificate.controller";
import { CertificateService } from "./certificate.service";
import { AuthMiddleware } from "src/middleware/auth.middleware";
import { FileService } from "src/file/file.service";

@Module({
    imports: [SequelizeModule.forFeature([Certificate, User, Course])],
    controllers: [CertificateController],
    providers: [CertificateService, FileService]
})
export class CertificateModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
        .apply(AuthMiddleware)
        .forRoutes(CertificateController)
    }
}