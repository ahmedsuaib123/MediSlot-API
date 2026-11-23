import {Transform,Type} from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { BloodGroup, Gender } from '../../users/entities/users.entity.js';

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    fullName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    contact: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    password: string;
    
    @Type(()=> Number)
    @IsInt()
    @Min(0)
    @Max(120)
    age: number;

    @Transform(({ value }) => 
      typeof value === 'string' ? value.toLowerCase() : value,
    )
    @IsEnum(Gender)
    gender: Gender;

    @IsEnum(BloodGroup)
    bloodGroup:BloodGroup;

    @IsString()
    @IsNotEmpty()
    @MaxLength(1000)
    address: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    emergencyContact: string;
  }


