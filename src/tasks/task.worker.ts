// import { Injectable, Logger } from '@nestjs/common';
// import { Interval } from '@nestjs/schedule';
// import { TaskService } from './tasks.service';

// @Injectable()
// export class TaskWorker {
//   private readonly logger = new Logger(TaskWorker.name);
//   private isProcessing = false;

//   constructor(private readonly taskService: TaskService) {
//     this.logger.log('Task Worker initialized');
//   }

//   @Interval(1000) // Check for tasks every second
//   async processTasks() {
//     // Prevent multiple simultaneous processing
//     if (this.isProcessing) {
//       return;
//     }

//     try {
//       this.isProcessing = true;
//       this.logger.debug('Worker checking for tasks...');
//       await this.taskService.processNextTask();
//     } catch (error) {
//       this.logger.error(`Worker error: ${error.message}`);
//     } finally {
//       this.isProcessing = false;
//     }
//   }
// }