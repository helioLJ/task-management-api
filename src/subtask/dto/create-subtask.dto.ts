import { IsNumber, IsString } from 'class-validator';

export class CreateSubtaskDto {
  @IsString()
  title: string;
  @IsNumber()
  taskId: number;
}
