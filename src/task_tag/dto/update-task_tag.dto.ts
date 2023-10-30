import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskTagDto } from './create-task_tag.dto';

export class UpdateTaskTagDto extends PartialType(CreateTaskTagDto) {}
