import { Controller, Body, Patch, Delete, UseGuards } from '@nestjs/common';
import { TaskTagService } from './task_tag.service';
import { UpdateTaskTagDto } from './dto/update-task_tag.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('task-tag')
export class TaskTagController {
  constructor(private readonly taskTagService: TaskTagService) {}

  @Patch()
  update(@Body() updateTaskTagDto: UpdateTaskTagDto) {
    return this.taskTagService.update(updateTaskTagDto);
  }

  @Delete()
  remove(@Body() updateTaskTagDto: UpdateTaskTagDto) {
    return this.taskTagService.remove(updateTaskTagDto);
  }
}
