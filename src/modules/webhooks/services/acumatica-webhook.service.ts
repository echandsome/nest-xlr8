import { Injectable } from '@nestjs/common';
import { AcumaticaWebhookDto } from '../dto/acumatica-webhook.dto';
import { CustomLoggerService } from '@/core/logger/logger.service';

@Injectable()
export class AcumaticaWebhookService {
  constructor(private readonly logger: CustomLoggerService) {}

  async handleWebhook(webhookData: AcumaticaWebhookDto): Promise<void> {
    this.logger.log(`Processing Acumatica webhook: ${webhookData.eventType || 'unknown'} - ${webhookData.entityType || 'unknown'}`);

    try {
      // Log the entire webhook data for debugging
      this.logger.debug('Acumatica webhook data:', JSON.stringify(webhookData, null, 2));

      const entityType = webhookData.entityType || 'unknown';
      const eventType = webhookData.eventType || 'unknown';
      
      switch (entityType) {
        case 'Customer':
          await this.handleCustomerWebhook(webhookData.data, eventType);
          break;
        case 'SalesOrder':
          await this.handleOrderWebhook(webhookData.data, eventType);
          break;
        case 'InventoryItem':
          await this.handleProductWebhook(webhookData.data, eventType);
          break;
        default:
          this.logger.warn(`Unhandled Acumatica webhook entity type: ${entityType}`);
          // Still process the webhook data for debugging
          await this.handleGenericWebhook(webhookData);
      }
    } catch (error) {
      this.logger.error(`Error processing Acumatica webhook: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async handleCustomerWebhook(customerData: any, eventType: string): Promise<void> {
    this.logger.log(`Processing Acumatica customer data (${eventType}):`, JSON.stringify(customerData, null, 2));
    
    // TODO: Implement Acumatica customer synchronization logic
    
    this.logger.log(`Acumatica Customer data processed successfully`);
  }

  private async handleOrderWebhook(orderData: any, eventType: string): Promise<void> {
    this.logger.log(`Processing Acumatica order data (${eventType}):`, JSON.stringify(orderData, null, 2));
    
    // TODO: Implement Acumatica order synchronization logic
    
    this.logger.log(`Acumatica Order data processed successfully`);
  }

  private async handleProductWebhook(productData: any, eventType: string): Promise<void> {
    this.logger.log(`Processing Acumatica product data (${eventType}):`, JSON.stringify(productData, null, 2));
    
    // TODO: Implement Acumatica product synchronization logic
    
    this.logger.log(`Acumatica Product data processed successfully`);
  }

  private async handleGenericWebhook(webhookData: any): Promise<void> {
    this.logger.log(`Processing generic Acumatica webhook data:`, JSON.stringify(webhookData, null, 2));
    
    // TODO: Implement generic webhook handling logic
    
    this.logger.log(`Generic Acumatica webhook data processed successfully`);
  }
}
