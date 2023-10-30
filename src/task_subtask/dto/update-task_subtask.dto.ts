import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskSubtaskDto } from './create-task_subtask.dto';

export class UpdateTaskSubtaskDto extends PartialType(CreateTaskSubtaskDto) {}
