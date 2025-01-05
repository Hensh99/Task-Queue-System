import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable } from '@nestjs/common';

@Injectable()
@Processor('tasks')
export class TasksProcessor {
  @Process()
  async handleTask(job: Job) {
    console.log(`Processing task [${job.id}]:`, job.data);
    try {
      // Simulate task processing logic (email sending, etc.)
      if (job.data.type === 'email') {
        console.log('Sending email to:', job.data.payload.to);
        // Simulating failure to test retry logic
        if (Math.random() < 0.5) {
          throw new Error('Task failed!');
        }
      }
      console.log(`Task [${job.id}] processed successfully`);
    } catch (error) {
      console.error(`Task [${job.id}] failed:`, error.message);
      throw error;
    }
  }
}
