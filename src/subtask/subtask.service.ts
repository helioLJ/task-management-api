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

  async update(id: number, updateSubtaskDto: UpdateSubtaskDto, userId: number) {
    return `This action updates a #${id} subtask`;
  }

  async remove(id: number, userId: number) {
    return `This action removes a #${id} subtask`;
  }
}
