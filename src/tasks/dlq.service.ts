import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class DlqService {
  private readonly logger = new Logger(DlqService.name);

  constructor(@InjectQueue('dlq') private readonly dlqQueue: Queue) {}

  async addToDlq(job, errorMessage: string) {
    await this.dlqQueue.add('failedTask', {
      ...job.data,
      failedReason: errorMessage,
    });
    this.logger.log(`Task [${job.id}] moved to DLQ`);
  }

  async getDlqJobs() {
    const jobs = await this.dlqQueue.getFailed();
    return jobs.map((job) => ({
      id: job.id,
      data: job.data,
      failedReason: job.failedReason,
    }));
  }

  async clearDlq() {
    const jobs = await this.dlqQueue.getFailed();
    await Promise.all(jobs.map((job) => job.remove()));
    return { status: 'DLQ cleared' };
  }
}
