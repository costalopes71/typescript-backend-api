import { IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateAddressDTO } from "./address.dto";

export class CreateUserDTO {

    @IsString()
    public firstName!: string;

    @IsString()
    public lastName!: string;

    @IsString()
    public email!: string;

    @IsString()
    public password!: string;

    @IsOptional()
    @ValidateNested()
    public address?: CreateAddressDTO;

}
