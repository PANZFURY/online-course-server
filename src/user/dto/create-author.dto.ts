import { IsNotEmpty, IsString } from "class-validator";

export class CreateAuthorDto {
    @IsString()
    @IsNotEmpty()
    bio: string;
}