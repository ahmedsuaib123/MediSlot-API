import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Matches, Min } from 'class-validator';
import { PaginationDto } from '../../common/pagination.dto.js';
import { AppointmentStatus } from '../entities/appointments.entity.js';

const DATE = /^\d{4}-\d{2}-\d{2}$/;

export class ListAppointmentsDto extends PaginationDto {
  @IsOptional() @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  doctorId?: number;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  patientId?: number;

  @IsOptional() @Matches(DATE, { message: 'date must be YYYY-MM-DD' })
  date?: string;
}

export class ScheduleQueryDto {
  @IsOptional() @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @IsOptional() @Matches(DATE, { message: 'date must be YYYY-MM-DD' })
  date?: string;
}