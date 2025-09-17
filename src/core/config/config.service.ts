import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private config: NestConfigService) {}

  get databaseUrl(): string {
    return this.config.get<string>('DATABASE_URL', 'mongodb://localhost:27017/nest-xlr8')!;
  }

  get jwtSecret(): string {
    return this.config.get<string>('JWT_SECRET')!;
  }

  get jwtExpiresIn(): string {
    return this.config.get<string>('JWT_EXPIRES_IN', '1h');
  }

  get port(): number {
    return Number(this.config.get<string>('PORT')) || 3000;
  }

  get nodeEnv(): string {
    return this.config.get<string>('NODE_ENV', 'development');
  }

  get corsOrigin(): string {
    return this.config.get<string>('CORS_ORIGIN', 'http://localhost:3000');
  }

  get rateLimitTtl(): number {
    return Number(this.config.get<string>('RATE_LIMIT_TTL')) || 60;
  }

  get rateLimitLimit(): number {
    return Number(this.config.get<string>('RATE_LIMIT_LIMIT')) || 100;
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get globalPrefix(): string {
    return this.config.get<string>('GLOBAL_PREFIX', 'api/v1');
  }

  get logLevel(): string {
    return this.config.get<string>('LOG_LEVEL', 'info');
  }

  get logDir(): string {
    return this.config.get<string>('LOG_DIR', 'src/logs');
  }

  get logMaxFiles(): number {
    return Number(this.config.get<string>('LOG_MAX_FILES')) || 5;
  }

  get logMaxSize(): string {
    return this.config.get<string>('LOG_MAX_SIZE', '20m');
  }

  get bigCommerceWebhookSecret(): string {
    return this.config.get<string>('BIGCOMMERCE_WEBHOOK_SECRET')!;
  }

  get b2bBigCommerceWebhookSecret(): string {
    return this.config.get<string>('B2B_BIGCOMMERCE_WEBHOOK_SECRET')!;
  }

  get acumaticaWebhookSecret(): string {
    return this.config.get<string>('ACUMATICA_WEBHOOK_SECRET')!;
  }
}
