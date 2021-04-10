import { IsString } from "class-validator";

export class LogInDTO {

    @IsString()
    public email!: string;

    @IsString()
    public password!: string;

}