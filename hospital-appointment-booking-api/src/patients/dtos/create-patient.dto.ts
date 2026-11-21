import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';
import { BloodGroup } from '../../users/entities/users.entity.js';

export class CreatePatientDto {
  @Type(() => Number) @IsInt() @Min(1)
  userId: number;

  @IsEnum(BloodGroup)
  bloodGroup: BloodGroup;

  @IsString() @IsNotEmpty() @MaxLength(1000)
  address: string;

  @IsString() @IsNotEmpty() @MaxLength(20)
  emergencyContact: string;
}