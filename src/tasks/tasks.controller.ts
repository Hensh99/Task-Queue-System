import { Controller, Post, Body, Get, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { DlqService } from './dlq.service';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly dlqService: DlqService
  ) {}

  // Endpoint to add a task to the queue
  @Post()
  async addTask(@Body() createTaskDto: { type: string; payload: any; visibility_time?: string }) {
    return this.tasksService.addTask(createTaskDto);
  }

  // Endpoint to get tasks from the DLQ
  @Get('/dlq')
  async getDlqTasks() {
    const dlqTasks = await this.dlqService.getDlqTasks();
    return dlqTasks.map((job) => ({
      id: job.id,
      type: job.name,
      data: job.data,
      failedReason: job.failedReason,
      attemptsMade: job.attemptsMade,
    }));
  }

  // Endpoint to clear the DLQ
  @Delete('/dlq')
  async clearDlq() {
    return this.dlqService.clearDlq();
  }
}
