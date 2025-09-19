import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BigCommerce, BigCommerceSchema } from '@/core/database/schemas/bigcommerce.schema';
import { B2BBigCommerceService } from './b2b-bigcommerce.service';
import { B2BBigCommerceController } from './b2b-bigcommerce.controller';
import { ConfigModule } from '@/core/config/config.module';
import { LoggerModule } from '@/core/logger/logger.module';
import { JobQueueService } from '@/core/redis/job-queue.service';

@Module({
  providers: [B2BBigCommerceService, JobQueueService],
  controllers: [B2BBigCommerceController],
  exports: [B2BBigCommerceService],
})
export class B2BBigCommerceModule {}
