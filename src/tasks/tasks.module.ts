import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TasksProcessor } from './tasks.processor';
import { DlqService } from './dlq.service';

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: 'tasks',
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000, // Initial delay
          },
          removeOnComplete: false, // Remove successful jobs
          removeOnFail: false,    // Keep failed jobs for analysis
        },
      },
      {
        name: 'dlq',
        defaultJobOptions: {
          removeOnComplete: false,
        },
      }
    ),
  ],
  controllers: [TasksController],
  providers: [TasksService, TasksProcessor, DlqService]
  
})
export class TasksModule {}
