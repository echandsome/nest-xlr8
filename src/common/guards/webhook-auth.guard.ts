import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@/core/config/config.service';
import { CustomLoggerService } from '@/core/logger/logger.service';
import * as crypto from 'crypto';

@Injectable()
export class WebhookAuthGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private logger: CustomLoggerService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const signature = request.headers['x-bc-hmac-sha256'] || request.headers['x-acumatica-signature'];
    const webhookUrl = request.url;
    const method = request.method;
    const body = request.body;

    // test
    return true;

    if (!signature) {
      this.logger.warn('Webhook request missing signature header');
      throw new UnauthorizedException('Missing webhook signature');
    }

    // Determine which platform based on the URL path
    if (webhookUrl.includes('/bigcommerce')) {
      return this.validateBigCommerceWebhook(signature, body);
    } else if (webhookUrl.includes('/b2b-bigcommerce')) {
      return this.validateB2BBigCommerceWebhook(signature, body);
    } else if (webhookUrl.includes('/acumatica')) {
      return this.validateAcumaticaWebhook(signature, body);
    }

    this.logger.warn(`Unknown webhook platform for URL: ${webhookUrl}`);
    throw new UnauthorizedException('Unknown webhook platform');
  }

  private validateBigCommerceWebhook(signature: string, body: any): boolean {
    const webhookSecret = this.configService.bigCommerceWebhookSecret;
    if (!webhookSecret) {
      this.logger.error('BigCommerce webhook secret not configured');
      throw new UnauthorizedException('Webhook secret not configured');
    }

    const payload = JSON.stringify(body);
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(payload)
      .digest('base64');

    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );

    if (!isValid) {
      this.logger.warn('Invalid BigCommerce webhook signature');
      throw new UnauthorizedException('Invalid webhook signature');
    }

    return true;
  }

  private validateB2BBigCommerceWebhook(signature: string, body: any): boolean {
    const webhookSecret = this.configService.b2bBigCommerceWebhookSecret;
    if (!webhookSecret) {
      this.logger.error('B2B BigCommerce webhook secret not configured');
      throw new UnauthorizedException('Webhook secret not configured');
    }

    const payload = JSON.stringify(body);
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(payload)
      .digest('base64');

    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );

    if (!isValid) {
      this.logger.warn('Invalid B2B BigCommerce webhook signature');
      throw new UnauthorizedException('Invalid webhook signature');
    }

    return true;
  }

  private validateAcumaticaWebhook(signature: string, body: any): boolean {
    const webhookSecret = this.configService.acumaticaWebhookSecret;
    if (!webhookSecret) {
      this.logger.error('Acumatica webhook secret not configured');
      throw new UnauthorizedException('Webhook secret not configured');
    }

    const payload = JSON.stringify(body);
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(payload)
      .digest('hex');

    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );

    if (!isValid) {
      this.logger.warn('Invalid Acumatica webhook signature');
      throw new UnauthorizedException('Invalid webhook signature');
    }

    return true;
  }
}
