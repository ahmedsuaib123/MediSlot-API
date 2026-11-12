import { Type } from "class-transformer";
import { IsInt, IsString, Min, MinLength,MaxLength } from "class-validator";

export class CreateDoctorDto{
    @Type(()=>Number)
    @IsInt()
    @Min(1)
    userId:number;

    @IsString()
    @MinLength(3)
    @MaxLength(50)
    specialization:string;

    @Type(()=>Number)
    @IsInt()
    @Min(0)
    consultationFee:number;

    @Type(()=>Number)
    @IsInt()
    @Min(0)
    experienceYear:number;
}