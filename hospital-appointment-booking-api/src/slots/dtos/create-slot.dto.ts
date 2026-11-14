import {IsInt,IsNotEmpty,IsDateString,IsString,Min,Matches} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSlotDto {

    @Type(() => Number)
    @IsInt()
    @Min(1)
    doctorId: number;

    @IsDateString()
    @IsNotEmpty()
    slotDate: string;

    @IsString()
    @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    start_time: string;

    @IsString()
    @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    end_time: string;
}
