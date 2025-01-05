import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { TasksController } from './tasks/tasks.controller';
import { TasksService } from './tasks/tasks.service';
import { TasksProcessor } from './tasks/tasks.processor';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost', 
        port: 6379, 
      },
    }),
    TasksModule, 
  ],
  providers: [AppService],
})
export class AppModule {}