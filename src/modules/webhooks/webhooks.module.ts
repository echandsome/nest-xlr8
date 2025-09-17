import { Module } from '@nestjs/common';
import { BigCommerceWebhookController } from './controllers/bigcommerce-webhook.controller';
import { B2BBigCommerceWebhookController } from './controllers/b2b-bigcommerce-webhook.controller';
import { AcumaticaWebhookController } from './controllers/acumatica-webhook.controller';
import { BigCommerceWebhookService } from './services/bigcommerce-webhook.service';
import { B2BBigCommerceWebhookService } from './services/b2b-bigcommerce-webhook.service';
import { AcumaticaWebhookService } from './services/acumatica-webhook.service';

@Module({
  controllers: [
    BigCommerceWebhookController,
    B2BBigCommerceWebhookController,
    AcumaticaWebhookController,
  ],
  providers: [
    BigCommerceWebhookService,
    B2BBigCommerceWebhookService,
    AcumaticaWebhookService,
  ],
  exports: [
    BigCommerceWebhookService,
    B2BBigCommerceWebhookService,
    AcumaticaWebhookService,
  ],
})
export class WebhooksModule {}
