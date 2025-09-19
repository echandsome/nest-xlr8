import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@/core/config/config.service';
import { CustomLoggerService } from '@/core/logger/logger.service';

@Injectable()
export class WebhookAuthGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private logger: CustomLoggerService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const secretKey = request.headers['x-bc-secret-key'] || request.headers['x-acumatica-secret-key'];
    const webhookUrl = request.url;

    if (!secretKey) {
      this.logger.warn('Webhook request missing secret key header');
      throw new UnauthorizedException('Missing webhook secret key');
    }

    // Determine which platform based on the URL path
    if (webhookUrl.includes('/bigcommerce')) {
      return secretKey === this.configService.bigCommerceWebhookSecret;
    } else if (webhookUrl.includes('/b2b-bigcommerce')) {
      return secretKey === this.configService.b2bBigCommerceWebhookSecret;
    } else if (webhookUrl.includes('/acumatica')) {
      return secretKey === this.configService.acumaticaWebhookSecret;
    }

    this.logger.warn(`Unknown webhook platform for URL: ${webhookUrl}`);
    throw new UnauthorizedException('Unknown webhook platform');
  }
}
