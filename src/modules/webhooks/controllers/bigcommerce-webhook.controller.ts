import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { BigCommerceWebhookDto } from '../dto/bigcommerce-webhook.dto';
import { BigCommerceWebhookService } from '../services/bigcommerce-webhook.service';
import { WebhookAuthGuard } from '@/common/guards/webhook-auth.guard';
import { CustomLoggerService } from '@/core/logger/logger.service';

@ApiTags('Webhooks - BigCommerce')
@ApiSecurity('webhook')
@Controller('webhooks/bigcommerce')
@UseGuards(WebhookAuthGuard)
export class BigCommerceWebhookController {
  constructor(
    private readonly bigCommerceWebhookService: BigCommerceWebhookService,
    private readonly logger: CustomLoggerService
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Handle BigCommerce webhook',
    description: 'Receives and processes webhooks from BigCommerce platform'
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
  async handleWebhook(@Body() payload: BigCommerceWebhookDto) {
    this.logger.log(`Received BigCommerce webhook: ${JSON.stringify(payload) || 'unknown'}`);
    
    try {
      // Handle case where webhook might be undefined
      if (!payload.scope) {
        this.logger.warn('Received webhook payload without webhook data');
        return {
          success: false,
          message: 'Invalid webhook payload - missing webhook data',
          timestamp: new Date().toISOString()
        };
      }

      await this.bigCommerceWebhookService.handleWebhook(payload);
      
      return {
        success: true,
        message: 'Webhook processed successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error(`Error processing BigCommerce webhook: ${error.message}`, error.stack);
      throw error;
    }
  }
}
