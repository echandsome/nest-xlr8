import { Module } from '@nestjs/common';
import { JobProcessorModule } from './job-processor.module';
import { BigCommerceModule } from '@/modules/bigcommerce/bigcommerce.module';
import { B2BBigCommerceModule } from '@/modules/b2b-bigcommerce/b2b-bigcommerce.module';
import { AcumaticaModule } from '@/modules/acumatica/acumatica.module';

@Module({
  imports: [
    JobProcessorModule,
    BigCommerceModule,
    B2BBigCommerceModule,
    AcumaticaModule,
  ],
  exports: [JobProcessorModule],
})
export class RedisModule {}
