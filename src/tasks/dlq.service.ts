import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class DlqService {
  private readonly logger = new Logger(DlqService.name);

  constructor(@InjectQueue('dlq') private readonly dlqQueue: Queue) {}

  async addToDlq(job, errorMessage: string) {
    await this.dlqQueue.add('failedTask', {
      originalJobId: job.id,
      ...job.data,
      failedReason: errorMessage,
      failedAt: new Date().toISOString(),
    });
  }

  async getDlqJobs() {
    // Changed: Get all jobs, not just failed ones
    const jobs = await this.dlqQueue.getJobs(['waiting', 'active', 'failed', 'completed']);
    return jobs.map((job) => ({
      id: job.id,
      originalJobId: job.data.originalJobId,
      type: job.data.type,
      payload: job.data.payload,
      failedReason: job.data.failedReason,
      failedAt: job.data.failedAt
    }));
  }

  async clearDlq() {
    // Changed: Clear all jobs, not just failed ones
    await this.dlqQueue.empty();
    this.logger.log('DLQ cleared');
    return { status: 'DLQ cleared' };
  }
}