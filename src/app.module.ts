import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { TaskModule } from './task/task.module';
import { SubtaskModule } from './subtask/subtask.module';
import { TagModule } from './tag/tag.module';
import { TaskTagModule } from './task_tag/task_tag.module';
import { TaskSubtaskModule } from './task_subtask/task_subtask.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    PrismaModule,
    TaskModule,
    SubtaskModule,
    TagModule,
    TaskTagModule,
    TaskSubtaskModule,
  ],
})
export class AppModule {}
