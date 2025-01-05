import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TasksProcessor } from './tasks.processor';
import { DlqService } from './dlq.service';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'tasks' }),
    BullModule.registerQueue({ name: 'dlq' }),
  ],
  controllers: [TasksController],
  providers: [TasksService, TasksProcessor, DlqService]
  
})
export class TasksModule {}
