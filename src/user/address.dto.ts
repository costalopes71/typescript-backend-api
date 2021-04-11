import { IsOptional, IsString } from "class-validator";

export class CreateAddressDTO {

    @IsString()
    public street!: string;

    @IsString()
    public city!: string;

    @IsString()
    @IsOptional()
    public country?: string;

}