import {Type} from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, MaxLength, Min  } from 'class-validator';

export class BookAppointmentDto {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    slotId: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(500)
    reason: string;
}