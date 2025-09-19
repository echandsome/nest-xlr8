import { Module } from '@nestjs/common';
import { AcumaticaService } from './acumatica.service';
import { AcumaticaController } from './acumatica.controller';
import { JobQueueService } from '@/core/redis/job-queue.service';

@Module({
  providers: [AcumaticaService, JobQueueService],
  controllers: [AcumaticaController],
  exports: [AcumaticaService],
})
export class AcumaticaModule {}
