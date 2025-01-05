import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class TasksService {
  constructor(@InjectQueue('tasks') private readonly taskQueue: Queue) {}

  // Method to add a task to the queue
  async addTask(createTaskDto: { type: string; payload: any; visibility_time?: string }) {
    const job = await this.taskQueue.add(createTaskDto.type, createTaskDto.payload, {
      delay: createTaskDto.visibility_time ? new Date(createTaskDto.visibility_time).getTime() - Date.now() : 0,
    });

    return {
      id: job.id,
      status: 'Task added to queue',
    };
  }
}
