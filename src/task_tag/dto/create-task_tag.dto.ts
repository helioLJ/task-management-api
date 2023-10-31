import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTaskTagDto {
  @IsNotEmpty()
  @IsNumber()
  tagId: number;
  @IsNotEmpty()
  @IsNumber()
  taskId: number;
}
