import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import * as dotenv from 'dotenv';
import { Dialect } from "sequelize";
import { UserModule } from "./users/user.module";
import { User } from "./users/entities/user.entity";
import { Author } from "./users/entities/author.entity";
import { FileModule } from "./file/file.module";

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
            models: [User, Author],
            autoLoadModels: true,
            synchronize: true,
        }),
        UserModule,
        FileModule
    ],
})

export class AppModule {}