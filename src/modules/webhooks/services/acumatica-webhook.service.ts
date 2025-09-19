import { Injectable } from '@nestjs/common';
import { AcumaticaWebhookDto } from '../dto/acumatica-webhook.dto';
import { CustomLoggerService } from '@/core/logger/logger.service';
import { AcumaticaService } from '@/modules/acumatica/acumatica.service';

@Injectable()
export class AcumaticaWebhookService {
  constructor(
    private readonly logger: CustomLoggerService,
    private readonly acumaticaService: AcumaticaService,
  ) {}

  async handleWebhook(webhookData: AcumaticaWebhookDto): Promise<void> {
    this.logger.log(`Received Acumatica webhook: ${JSON.stringify(webhookData)}`, 'AcumaticaWebhookService');

    await this.acumaticaService.processWebhook(webhookData);

    this.logger.log(`Acumatica webhook processed successfully`, 'AcumaticaWebhookService');
  }

}
