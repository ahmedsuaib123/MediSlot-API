import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString,IsNumber,Min,IsInt} from "class-validator";

export class UpdateDoctorDto{

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    specialization?:string;

    @IsOptional()
    @Type(()=>Number)
    @IsNumber()
    @Min(0)
    consultationFee?:number;

    @IsOptional()
    @Type(()=>Number)
    @IsInt()
    @Min(0)
    experienceYear?:number;
}