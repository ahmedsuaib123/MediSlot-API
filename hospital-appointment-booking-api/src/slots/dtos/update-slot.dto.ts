import { IsDateString, IsOptional, Matches } from 'class-validator';

export class UpdateSlotDto {

    @IsOptional()
    @IsDateString()
    slotDate?: string;

    @IsOptional()
    @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    start_time?: string;

    @IsOptional()
    @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    end_time?: string;
}
