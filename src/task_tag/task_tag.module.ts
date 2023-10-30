import { Module } from '@nestjs/common';
import { TaskTagService } from './task_tag.service';
import { TaskTagController } from './task_tag.controller';

@Module({
  controllers: [TaskTagController],
  providers: [TaskTagService],
})
export class TaskTagModule {}
