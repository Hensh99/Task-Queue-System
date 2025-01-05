import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class DlqService {
  constructor(@InjectQueue('dlq') private readonly dlqQueue: Queue) {}

  // Method to retrieve tasks in the dead-letter queue
  async getDlqTasks() {
    return this.dlqQueue.getJobs(['failed']);
  }

  // Method to clear the dead-letter queue
  async clearDlq() {
    const jobs = await this.dlqQueue.getJobs(['failed']);
    for (const job of jobs) {
      await job.remove();
    }
    return { status: 'DLQ cleared' };
  }
}
