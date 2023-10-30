import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskSubtaskService } from './task_subtask.service';
import { CreateTaskSubtaskDto } from './dto/create-task_subtask.dto';
import { UpdateTaskSubtaskDto } from './dto/update-task_subtask.dto';

@Controller('task-subtask')
export class TaskSubtaskController {
  constructor(private readonly taskSubtaskService: TaskSubtaskService) {}

  @Post()
  create(@Body() createTaskSubtaskDto: CreateTaskSubtaskDto) {
    return this.taskSubtaskService.create(createTaskSubtaskDto);
  }

  @Get()
  findAll() {
    return this.taskSubtaskService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskSubtaskService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskSubtaskDto: UpdateTaskSubtaskDto) {
    return this.taskSubtaskService.update(+id, updateTaskSubtaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskSubtaskService.remove(+id);
  }
}
