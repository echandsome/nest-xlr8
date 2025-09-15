import { Global, Module } from '@nestjs/common';
import { CustomLoggerService } from './logger.service';
import { ConfigModule } from '@/core/config/config.module';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [CustomLoggerService],
  exports: [CustomLoggerService],
})
export class LoggerModule {}
