import { Optional } from "@nestjs/common";
import { IsString } from "class-validator";

export class CreateLessonDto {

    @Optional()
    @IsString()
    title: string;

    @Optional()
    @IsString()
    content: string;

}