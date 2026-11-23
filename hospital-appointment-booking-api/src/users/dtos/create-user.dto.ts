import {IsString,IsNotEmpty,MaxLength,IsEmail,IsEnum,MinLength,IsInt,Min,ValidateIf,IsNumber} from 'class-validator';
import { Type } from 'class-transformer';
import {Gender,BloodGroup,UserRole} from '../entities/users.entity.js';

export class CreateUserDto {

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

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;

  @ValidateIf((o) => o.role === UserRole.DOCTOR)
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  specialization?: string;

  @ValidateIf((o) => o.role === UserRole.DOCTOR)
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  consultationFee?: number;

  @ValidateIf((o) => o.role === UserRole.DOCTOR)
  @Type(() => Number)
  @IsInt()
  @Min(0)
  experienceYear?: number;
}
