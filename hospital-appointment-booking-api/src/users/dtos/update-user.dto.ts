import { IsString,IsNotEmpty,IsOptional,MaxLength,IsBoolean} from 'class-validator';

export class UpdateUserDto {

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  fullname?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  contact?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
