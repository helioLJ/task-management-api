import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
// import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createTagDto: CreateTagDto) {
    console.log(createTagDto);
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

  findAll() {
    return `This action returns all tag`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tag`;
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return `This action updates a #${id} tag`;
  }

  remove(id: number) {
    return `This action removes a #${id} tag`;
  }
}
