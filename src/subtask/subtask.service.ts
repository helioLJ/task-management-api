import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubtaskService {
  constructor(private prisma: PrismaService) {}

  async create(createSubtaskDto: CreateSubtaskDto, userId: number) {
    try {
      const task = await this.prisma.task.findUnique({
        where: {
          id: createSubtaskDto.taskId,
        },
      });

      if (!task) throw new NotFoundException('Task not found.');
      if (userId !== task.userId)
        throw new ForbiddenException('This task is not yours.');

      const subtask = await this.prisma.subtask.create({
        data: {
          title: createSubtaskDto.title,
          taskId: createSubtaskDto.taskId,
        },
      });

      return subtask;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateSubtaskDto: UpdateSubtaskDto) {
    try {
      const subtask = await this.prisma.subtask.findUnique({
        where: {
          id: id,
        },
      });

      if (!subtask) throw new NotFoundException('Subtask not found.');

      const updatedSubtask = await this.prisma.subtask.update({
        data: {
          title: updateSubtaskDto.title,
          completed: updateSubtaskDto.completed,
        },
        where: {
          id,
        },
      });

      return updatedSubtask;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const subtask = await this.prisma.subtask.findUnique({
        where: {
          id: id,
        },
      });

      if (!subtask) throw new NotFoundException('Subtask not found.');

      await this.prisma.subtask.delete({
        where: {
          id: id,
        },
      });

      return { message: 'Subtask deleted.' };
    } catch (error) {
      throw error;
    }
  }
}
