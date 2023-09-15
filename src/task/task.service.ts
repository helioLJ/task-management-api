import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createTaskDto: CreateTaskDto) {
    try {
      const task = await this.prisma.task.create({
        data: {
          title: createTaskDto.title,
          userId: userId,
        },
      });

      return task;
    } catch (error) {
      throw error;
    }
  }

  async findAll(userId: number) {
    try {
      const tasks = await this.prisma.task.findMany({
        where: {
          userId: userId,
        },
      });

      if (!tasks) throw new NotFoundException('Task not found.');
      if (userId !== tasks[0].userId)
        throw new ForbiddenException('This task is not yours.');

      console.log(tasks);
      return tasks;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number, userId: number) {
    try {
      const task = await this.prisma.task.findUnique({
        where: {
          id: id,
        },
      });

      if (!task) throw new NotFoundException('Task not found.');
      if (userId !== task.userId)
        throw new ForbiddenException('This task is not yours.');

      return task;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, userId: number) {
    try {
      const task = await this.prisma.task.findUnique({
        where: {
          id: id,
        },
      });

      if (!task) throw new NotFoundException('Task not found.');
      if (userId !== task.userId)
        throw new ForbiddenException('This task is not yours.');

      const updatedTask = await this.prisma.task.update({
        data: {
          title: updateTaskDto.title,
          description: updateTaskDto.description,
          completed: updateTaskDto.completed,
          dueDate: updateTaskDto.dueDate,
          list: updateTaskDto.list,
        },
        where: {
          id,
        },
      });

      return updatedTask;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number, userId: number) {
    try {
      const task = await this.prisma.task.findUnique({
        where: {
          id: id,
        },
      });

      if (!task) throw new NotFoundException('Task not found.');
      if (userId !== task.userId)
        throw new ForbiddenException('This task is not yours.');

      await this.prisma.task.delete({
        where: {
          id: id,
        },
      });

      return { message: 'Task deleted.' };
    } catch (error) {
      throw error;
    }
  }
}
