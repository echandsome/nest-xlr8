import { Module, OnModuleInit } from '@nestjs/common';
import { JobQueueService } from './job-queue.service';
import { JobProcessorService } from './job-processor.service';
import { CustomLoggerService } from '@/core/logger/logger.service';

@Module({
  providers: [JobQueueService, JobProcessorService],
  exports: [JobQueueService, JobProcessorService],
})
export class JobProcessorModule implements OnModuleInit {
  constructor(
    private jobQueueService: JobQueueService,
    private jobProcessor: JobProcessorService,
    private logger: CustomLoggerService,
  ) {}

  async onModuleInit() {
    // Set up the generic job processor
    this.jobQueueService.getQueue().process('process-job', async (job) => {
      await this.jobProcessor.processJob(job);
    });

    this.logger.log('Job processors initialized', 'JobProcessorModule');
  }
}
