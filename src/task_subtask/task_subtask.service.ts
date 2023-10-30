import { Injectable } from '@nestjs/common';
import { CreateTaskSubtaskDto } from './dto/create-task_subtask.dto';
import { UpdateTaskSubtaskDto } from './dto/update-task_subtask.dto';

@Injectable()
export class TaskSubtaskService {
  create(createTaskSubtaskDto: CreateTaskSubtaskDto) {
    return 'This action adds a new taskSubtask';
  }

  findAll() {
    return `This action returns all taskSubtask`;
  }

  findOne(id: number) {
    return `This action returns a #${id} taskSubtask`;
  }

  update(id: number, updateTaskSubtaskDto: UpdateTaskSubtaskDto) {
    return `This action updates a #${id} taskSubtask`;
  }

  remove(id: number) {
    return `This action removes a #${id} taskSubtask`;
  }
}
