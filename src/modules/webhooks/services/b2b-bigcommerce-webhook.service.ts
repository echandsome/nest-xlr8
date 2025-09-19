import { Injectable } from '@nestjs/common';
import { B2BBigCommerceWebhookDto } from '../dto/b2b-bigcommerce-webhook.dto';
import { CustomLoggerService } from '@/core/logger/logger.service';
import { B2BBigCommerceService } from '@/modules/b2b-bigcommerce/b2b-bigcommerce.service';

@Injectable()
export class B2BBigCommerceWebhookService {
  constructor(
    private readonly logger: CustomLoggerService,
    private readonly b2bBigCommerceService: B2BBigCommerceService,
  ) {}

  async handleWebhook(webhookData: B2BBigCommerceWebhookDto): Promise<void> {
    this.logger.log(`Received B2B BigCommerce webhook: ${JSON.stringify(webhookData)}`, 'B2BBigCommerceWebhookService');

    await this.b2bBigCommerceService.processWebhook(webhookData);

    this.logger.log(`B2B BigCommerce webhook processed successfully`, 'B2BBigCommerceWebhookService');
  }

}
