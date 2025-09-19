import { Module, OnModuleInit } from '@nestjs/common';
import { JobQueueService } from './job-queue.service';
import { JobProcessorService } from './job-processor.service';
import { CustomLoggerService } from '@/core/logger/logger.service';
import { BigCommerceModule } from '@/modules/bigcommerce/bigcommerce.module';
import { B2BBigCommerceModule } from '@/modules/b2b-bigcommerce/b2b-bigcommerce.module';
import { AcumaticaModule } from '@/modules/acumatica/acumatica.module';

@Module({
  imports: [
    BigCommerceModule,
    B2BBigCommerceModule,
    AcumaticaModule,
  ],
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
