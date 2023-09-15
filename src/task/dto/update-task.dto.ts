import { IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;
  @IsBoolean()
  @IsOptional()
  completed?: boolean;
  @IsString()
  @IsOptional()
  description?: string;
  @IsDateString()
  @IsOptional()
  dueDate?: Date;
  @IsString()
  @IsOptional()
  list?: string;
}
