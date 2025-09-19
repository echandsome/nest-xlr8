import { Injectable } from '@nestjs/common';
import { BigCommerceWebhookDto } from '../dto/bigcommerce-webhook.dto';
import { CustomLoggerService } from '@/core/logger/logger.service';
import { BigCommerceService } from '@/modules/bigcommerce/bigcommerce.service';

@Injectable()
export class BigCommerceWebhookService {
  constructor(
    private readonly logger: CustomLoggerService,
    private readonly bigCommerceService: BigCommerceService,
  ) {}

  async handleWebhook(webhookData: BigCommerceWebhookDto): Promise<void> {
    this.logger.log(`Received BigCommerce webhook: ${JSON.stringify(webhookData)}`, 'BigCommerceWebhookService');

    await this.bigCommerceService.processWebhook(webhookData);

    this.logger.log(`BigCommerce webhook processed successfully`, 'BigCommerceWebhookService');
  }

}
