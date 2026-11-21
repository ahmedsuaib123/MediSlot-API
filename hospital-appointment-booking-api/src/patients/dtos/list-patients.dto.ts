import { IsOptional,IsString,isString } from "class-validator";
import {PaginationDto} from '../../common/pagination.dto.js';

export class ListPatientsDto extends PaginationDto{
    @IsOptional() @IsString()
    search?: string;
}