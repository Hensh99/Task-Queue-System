import { Controller, Post, Get, Delete, Body } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { DlqService } from './dlq.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly dlqService: DlqService,
  ) {}

  @Post()
  async addTask(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.addTask(createTaskDto);
  }

  @Get('metrics')
  async getMetrics() {
    return this.tasksService.getQueueMetrics();
  }

  @Get('dlq')
  async getDlqJobs() {
    return this.dlqService.getDlqJobs();
  }

  @Delete('dlq')
  async clearDlq() {
    return this.dlqService.clearDlq();
  }
}
