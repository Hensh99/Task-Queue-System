import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectQueue('tasks') private readonly taskQueue: Queue,
    @InjectQueue('dlq') private readonly dlqQueue: Queue,
  ) {}

  async addTask(createTaskDto: CreateTaskDto) {
    const delay = createTaskDto.visibility_time
      ? new Date(createTaskDto.visibility_time).getTime() - Date.now()
      : 0;

    const job = await this.taskQueue.add(
      {
        type: createTaskDto.type,
        payload: createTaskDto.payload,
        timestamp: new Date().toISOString(),
      },
      {
        delay: Math.max(0, delay),
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    );

    return {
      id: job.id,
      status: 'Task added to queue',
    };
  }

  async getQueueMetrics() {
    const [waiting, active, completed, failed] = await Promise.all([
      this.taskQueue.getWaitingCount(),
      this.taskQueue.getActiveCount(),
      this.taskQueue.getCompletedCount(),
      this.taskQueue.getFailedCount(),
    ]);

    // Changed: Get all DLQ jobs count
    const dlqJobs = await this.dlqQueue.getJobs(['waiting', 'active', 'failed', 'completed']);
    const dlqSize = dlqJobs.length;

    return {
      current_queue_size: waiting + active,
      total_processed: completed,
      total_failed: failed,
      dlq_size: dlqSize,
    };
  }
}
