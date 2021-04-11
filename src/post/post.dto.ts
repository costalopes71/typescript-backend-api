import { IsString } from "class-validator";

export class CreatePostDTO {

    @IsString()
    public content!: string;

    @IsString()
    public title!: string;

}