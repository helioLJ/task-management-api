import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
// import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createTagDto: CreateTagDto) {
    try {
      let tag = await this.prisma.tag.findUnique({
        where: {
          name: createTagDto.name,
          userId: userId,
        },
      });

      if (tag) throw new ForbiddenException('You already created this tag.');

      tag = await this.prisma.tag.create({
        data: {
          name: createTagDto.name,
          userId: userId,
        },
      });

      return tag;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAll(userId: number) {
    try {
      const tags = await this.prisma.tag.findMany({
        where: {
          userId: userId,
        },
      });

      if (userId !== tags[0].userId)
        throw new ForbiddenException('This tag is not yours.');

      return tags;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateTagDto: UpdateTagDto, userId: number) {
    try {
      const tag = await this.prisma.tag.findUnique({
        where: {
          id: id,
        },
      });

      if (!tag) throw new NotFoundException('Tag not found.');
      if (userId !== tag.userId)
        throw new ForbiddenException('This tag is not yours.');

      const updatedTag = await this.prisma.tag.update({
        data: {
          name: updateTagDto.name,
        },
        where: {
          id,
          userId,
        },
      });

      return updatedTag;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number, userId: number) {
    try {
      const tag = await this.prisma.tag.findUnique({
        where: {
          id: id,
        },
      });

      if (!tag) throw new NotFoundException('Tag not found.');
      if (userId !== tag.userId)
        throw new ForbiddenException('This tag is not yours.');

      await this.prisma.tag.delete({
        where: {
          id: id,
        },
      });

      return { message: 'Tag deleted.' };
    } catch (error) {
      throw error;
    }
  }
}
