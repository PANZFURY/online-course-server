import { IsNotEmpty, IsString, Min } from "class-validator";

export class CreateForumDto {
    @IsString()
    @IsNotEmpty()
    @Min(3)
    message: string;
}