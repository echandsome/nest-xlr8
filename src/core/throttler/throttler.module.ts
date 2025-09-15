import { Module } from '@nestjs/common';
import { ConfigModule } from '@/core/config/config.module';
import { ConfigService } from '@/core/config/config.service';
import { ThrottlerModule as NestThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    NestThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.rateLimitTtl * 1000, // Convert to milliseconds
          limit: configService.rateLimitLimit,
        },
      ],
      inject: [ConfigService],
    }), 
  ],
})
export class ThrottlerModule {}