import { Module } from '@nestjs/common';
import { BigCommerceService } from './bigcommerce.service';
import { BigCommerceController } from './bigcommerce.controller';
import { JobQueueService } from '@/core/redis/job-queue.service';
import { AcumaticaModule } from '../acumatica/acumatica.module';

@Module({
  imports: [AcumaticaModule],
  providers: [BigCommerceService, JobQueueService],
  controllers: [BigCommerceController],
  exports: [BigCommerceService],
})
export class BigCommerceModule {}
