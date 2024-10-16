import { Optional } from "@nestjs/common";
import {IsNumber, IsString, Min } from "class-validator";

export class UpdateCourseDto {

    @Optional()
    @IsString()
    title: string;

    @Optional()
    @IsString()
    description: string;

    @Optional()
    @IsNumber()
    @Min(0)
    price: number;
    

}