import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@GetUser('id') userId: number, @Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(userId, createTaskDto);
  }

  @Get()
  findAll(@GetUser('id') userId: number) {
    return this.taskService.findAll(userId);
  }

  @Get(':id')
  findOne(@GetUser('id') userId: number, @Param('id') id: string) {
    return this.taskService.findOne(+id, userId);
  }

  @Patch(':id')
  update(
    @GetUser('id') userId: number,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.update(+id, updateTaskDto, userId);
  }

  @Delete(':id')
  remove(@GetUser('id') userId: number, @Param('id') id: string) {
    return this.taskService.remove(+id, userId);
  }
}
