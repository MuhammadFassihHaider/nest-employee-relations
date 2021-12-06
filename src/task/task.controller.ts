import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post(':id')
  create(
    @Body() createTaskDto: CreateTaskDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.taskService.create(createTaskDto, id);
  }

  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @Get(':id')
  findAllTasksForEmployee(@Param('id') id: string) {
    return this.taskService.findAllTasksForEmployee(+id);
  }

  @Get(':id/search')
  async search(
    @Query('task') task: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.taskService.searchTaskByName(task, id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(+id, updateTaskDto);
  }

  @Delete('/remove-one/:taskId')
  removeOne(@Param('taskId', ParseIntPipe) taskId: number) {
    return this.taskService.removeOne(taskId);
  }

  @Delete('/remove-all/:userId')
  removeAll(@Param('userId', ParseIntPipe) userId: number) {
    return this.taskService.removeAll(userId);
  }
}
