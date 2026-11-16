import {IsEnum, IsOptional, IsString,  MaxLength } from 'class-validator';
import { BloodGroup } from '../../users/entities/users.entity.js';

export class UpdatePatientDto {
    @IsOptional()
    @IsEnum(BloodGroup)
    bloodGroup?: BloodGroup;

   
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    address?: string;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    emergencyContact?: string;
}