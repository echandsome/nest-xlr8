import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BigCommerce, BigCommerceSchema } from '@/core/database/schemas/bigcommerce.schema';
import { BigCommerceService } from './bigcommerce.service';
import { BigCommerceController } from './bigcommerce.controller';
import { ConfigModule } from '@/core/config/config.module';
import { LoggerModule } from '@/core/logger/logger.module';
import { JobQueueService } from '@/core/redis/job-queue.service';

@Module({
  providers: [BigCommerceService, JobQueueService],
  controllers: [BigCommerceController],
  exports: [BigCommerceService],
})
export class BigCommerceModule {}
