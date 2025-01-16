import { Processor, Process, OnQueueFailed } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';
import { DlqService } from './dlq.service';

@Injectable()
@Processor('tasks')
export class TasksProcessor {
  private readonly logger = new Logger(TasksProcessor.name);

  constructor(private readonly dlqService: DlqService) {}

  @Process()
  async handleTask(job: Job) {
    this.logger.log(`Processing task [${job.id}] of type: ${job.data.type}`);

    try {
      await this.processTask(job);
      this.logger.log(`Task [${job.id}] completed successfully`);
    } catch (error) {
      this.logger.error(`Task [${job.id}] failed: ${error.message}`);
      throw error;  // This will trigger a job failure and move it to DLQ
    }
  }

  @OnQueueFailed()
  async onQueueFailed(job: Job, error: Error) {
    if (job.attemptsMade >= job.opts.attempts) {
      await this.dlqService.addToDlq(job, error.message);
      this.logger.warn(
        `Task [${job.id}] moved to DLQ after ${job.attemptsMade} attempts`,
      );
    }
  }

  private async processTask(job: Job) {
    switch (job.data.type) {
      case 'email':
        await this.simulateEmailProcessing(job);
        break;
      default:
        throw new Error(`Unsupported task type: ${job.data.type}`);
    }
  }

  private async simulateEmailProcessing(job: Job) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (job.data.payload.to.includes('fail')) {
      throw new Error('Simulated email delivery failure');
    }
  }
}
