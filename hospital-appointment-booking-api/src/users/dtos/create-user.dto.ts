import { IsString,IsNotEmpty,MaxLength,IsEmail,IsEnum,MinLength,IsInt,Min } from "class-validator";
import { Gender, BloodGroup } from '../entities/users.entity.js';
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
    @Min(0)
    age:number;

    @IsEnum(Gender)
    gender:Gender;
    @IsEnum(BloodGroup)
    bloodgroup: BloodGroup;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password:string;
}