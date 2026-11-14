import { IsString,IsNotEmpty,MaxLength,IsEmail,IsEnum,MinLength,IsInt,Min,IsIn,ValidateIf,IsNumber} from "class-validator";
import { Gender, BloodGroup, UserRole } from '../entities/users.entity.js';
import { Type } from 'class-transformer';

export class CreateUserDto{
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    fullname:string;

    @IsEmail()
    @MaxLength(50)
    email:string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(14)
    contact:string;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    age:number;

    @IsEnum(Gender)
    gender:Gender;

    @IsEnum(BloodGroup)
    bloodgroup: BloodGroup;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password:string;

    @IsNotEmpty()
    @IsIn([UserRole.PATIENT,UserRole.DOCTOR])
    role:UserRole;

    @ValidateIf((o)=>o.role===UserRole.DOCTOR)
    @IsString()
    @IsNotEmpty()
    specialization:string;

    @ValidateIf((o)=>o.role===UserRole.DOCTOR)
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    consultationFee:number;

    @ValidateIf((o)=>o.role===UserRole.DOCTOR)
    @Type(() => Number)
    @IsInt()
    @Min(0)
    experienceYear:number;
}