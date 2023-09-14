import { IsString, IsOptional, IsDate, IsBoolean } from 'class-validator';

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
  @IsDate()
  @IsOptional()
  dueDate?: Date;
  @IsString()
  @IsOptional()
  list?: string;
}
