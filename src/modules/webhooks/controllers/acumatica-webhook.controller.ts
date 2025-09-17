import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { AcumaticaWebhookDto } from '../dto/acumatica-webhook.dto';
import { AcumaticaWebhookService } from '../services/acumatica-webhook.service';
import { WebhookAuthGuard } from '@/common/guards/webhook-auth.guard';
import { CustomLoggerService } from '@/core/logger/logger.service';

@ApiTags('Webhooks - Acumatica')
@ApiSecurity('webhook')
@Controller('webhooks/acumatica')
@UseGuards(WebhookAuthGuard)
export class AcumaticaWebhookController {
  constructor(
    private readonly acumaticaWebhookService: AcumaticaWebhookService,
    private readonly logger: CustomLoggerService
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Handle Acumatica webhook',
    description: 'Receives and processes webhooks from Acumatica ERP system'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Webhook processed successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Webhook processed successfully' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid webhook signature' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad Request - Invalid webhook payload' 
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal Server Error' 
  })
  async handleWebhook(@Body() payload: AcumaticaWebhookDto) {
    this.logger.log(`Received Acumatica webhook: ${JSON.stringify(payload) || 'unknown'}`);

    try {
      // Handle case where webhook might be undefined
      if (!payload.eventType) {
        this.logger.warn('Received webhook payload without webhook data');
        return {
          success: false,
          message: 'Invalid webhook payload - missing webhook data',
          timestamp: new Date().toISOString()
        };
      }

      await this.acumaticaWebhookService.handleWebhook(payload);
      
      return {
        success: true,
        message: 'Webhook processed successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error(`Error processing Acumatica webhook: ${error.message}`, error.stack);
      throw error;
    }
  }
}
