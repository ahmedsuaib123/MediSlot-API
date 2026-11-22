import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import {
  Gender,
  BloodGroup,
} from '../../users/entities/users.entity.js';

export class CreateDoctorDto {

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  fullname: string;

  @IsEmail()
  @MaxLength(150)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  contact: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  age: number;

  @IsEnum(Gender)
  gender: Gender;

  @IsEnum(BloodGroup)
  bloodgroup: BloodGroup;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  specialization: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  consultationFee: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  experienceYear: number;
}