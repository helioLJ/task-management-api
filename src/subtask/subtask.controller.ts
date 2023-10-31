import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SubtaskService } from './subtask.service';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorator/get-user.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('subtask')
export class SubtaskController {
  constructor(private readonly subtaskService: SubtaskService) {}

  @Post()
  create(
    @GetUser('id') userId: number,
    @Body() createSubtaskDto: CreateSubtaskDto,
  ) {
    return this.subtaskService.create(createSubtaskDto, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubtaskDto: UpdateSubtaskDto) {
    return this.subtaskService.update(+id, updateSubtaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subtaskService.remove(+id);
  }
}
