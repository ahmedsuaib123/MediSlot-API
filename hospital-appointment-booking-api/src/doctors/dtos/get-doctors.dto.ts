import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class GetDoctorDto{
    @IsOptional()
    @IsString()
    searchByName?:string;

    @IsOptional()
    @Type(()=>Number)
    @IsInt()
    @Min(1)
    searchByID?:number;

    @IsOptional()
    @IsString()
    searchBySpecialization?:string;
}