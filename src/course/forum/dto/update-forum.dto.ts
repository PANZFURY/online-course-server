import { IsNotEmpty, IsString, Min } from "class-validator";

export class UpdateForumDto {
    @IsString()
    @IsNotEmpty()
    @Min(3)
    message: string;
}