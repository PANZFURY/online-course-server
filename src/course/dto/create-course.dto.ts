import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class CreateCourseDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    price: number;
    

}