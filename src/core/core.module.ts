import { Module } from '@nestjs/common';
import { ConfigModule } from '@/core/config/config.module';
import { ThrottlerModule } from '@/core/throttler/throttler.module';
import { DatabaseModule } from '@/core/database/database.module';
import { LoggerModule } from '@/core/logger/logger.module';
import { JobProcessorModule } from '@/core/redis/job-processor.module';

@Module({
    imports: [
        ConfigModule,
        ThrottlerModule,
        DatabaseModule,
        LoggerModule,
        JobProcessorModule,
    ],
})
export class CoreModule {}