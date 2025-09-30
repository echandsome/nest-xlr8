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

  get bigCommerceStoreHash(): string {
    return this.config.get<string>('BIGCOMMERCE_STORE_HASH')!;
  }

  get bigCommerceToken(): string {
    return this.config.get<string>('BIGCOMMERCE_TOKEN')!;
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

  get redisHost(): string {
    return this.config.get<string>('REDIS_HOST', 'localhost');
  }

  get redisPort(): number {
    return Number(this.config.get<string>('REDIS_PORT')) || 6379;
  }

  get redisPassword(): string | undefined {
    return this.config.get<string>('REDIS_PASSWORD');
  }

  get redisDb(): number {
    return Number(this.config.get<string>('REDIS_DB')) || 0;
  }

  get redisUrl(): string {
    return this.config.get<string>('REDIS_URL', `redis://${this.redisHost}:${this.redisPort}/${this.redisDb}`);
  }

  get acumaticaInstanceUri(): string {
    return this.config.get<string>('ACUMATICA_INSTANCE_URI')!;
  }

  get acumaticaApiVersion(): string {
    return this.config.get<string>('ACUMATICA_API_VERSION')!;
  }

  get acumaticaUsername(): string {
    return this.config.get<string>('ACUMATICA_USERNAME')!;
  }

  get acumaticaPassword(): string {
    return this.config.get<string>('ACUMATICA_PASSWORD')!;
  }
  
  get acumaticaCompany(): string {
    return this.config.get<string>('ACUMATICA_COMPANY')!;
  }

  get acumaticaEndpointName(): string {
    return this.config.get<string>('ACUMATICA_ENDPOINT_NAME')!;
  }

  get apiNinjasApiKey(): string {
    return this.config.get<string>('API_NINJAS_API_KEY')!;
  }

}
