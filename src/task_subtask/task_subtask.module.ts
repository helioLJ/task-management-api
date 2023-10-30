import { Module } from '@nestjs/common';
import { TaskSubtaskService } from './task_subtask.service';
import { TaskSubtaskController } from './task_subtask.controller';

@Module({
  controllers: [TaskSubtaskController],
  providers: [TaskSubtaskService],
})
export class TaskSubtaskModule {}
