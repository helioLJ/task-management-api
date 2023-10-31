import { Injectable } from '@nestjs/common';
import { UpdateTaskTagDto } from './dto/update-task_tag.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TaskTagService {
  constructor(private prisma: PrismaService) {}

  async update(updateTaskTagDto: UpdateTaskTagDto) {
    const updatedTask = await this.prisma.task.update({
      where: {
        id: updateTaskTagDto.taskId,
      },
      data: {
        tags: {
          connect: {
            id: updateTaskTagDto.tagId,
          },
        },
      },
    });

    return updatedTask;
  }

  async remove(updateTaskTagDto: UpdateTaskTagDto) {
    const updatedTask = await this.prisma.task.update({
      where: {
        id: updateTaskTagDto.taskId,
      },
      data: {
        tags: {
          disconnect: {
            id: updateTaskTagDto.tagId,
          },
        },
      },
    });

    return updatedTask;
  }
}
