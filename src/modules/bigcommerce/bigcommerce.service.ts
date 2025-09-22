import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BigCommerce, BigCommerceDocument, Category } from '@/core/database/schemas/bigcommerce.schema';
import { CustomLoggerService } from '@/core/logger/logger.service';
import { ConfigService } from '@/core/config/config.service';
import { getOrderById } from '@/shared/apis/bigcommerce';
import { JobQueueService } from '@/core/redis/job-queue.service';

@Injectable()
export class BigCommerceService {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: CustomLoggerService,
    private readonly jobQueueService: JobQueueService,
    @InjectModel(BigCommerce.name) private bigCommerceModel: Model<BigCommerceDocument>,
  ) {}

  /**
   * Process BigCommerce webhook data from job queue
   */
  async processWebhook(webhookData: any): Promise<void> {
    this.logger.log(`Processing BigCommerce webhook: ${webhookData.scope || 'unknown'}`);

    try {
      const scope = webhookData.scope || 'unknown';
      
      switch (scope) {
        case 'store/customer/created':
        case 'store/customer/updated':
          await this.handleCustomer(webhookData);
          break;
        case 'store/order/created':
        case 'store/order/updated':
        case 'store/order/statusUpdated':
          await this.handleOrder(webhookData);
          break;
        case 'store/product/created':
        case 'store/product/updated':
        case 'store/product/deleted':
          await this.handleProduct(webhookData);
          break;
        default:
          this.logger.warn(`Unhandled BigCommerce webhook scope: ${scope}`);
          await this.handleGeneric(webhookData);
      }
    } catch (error) {
      this.logger.error(`Error processing BigCommerce webhook: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Save webhook data to database
   */
  async saveWebhookToDatabase(webhookData: any): Promise<void> {
    try {
      const bigCommerceData = new this.bigCommerceModel({
        producer: webhookData.producer,
        hash: webhookData.hash,
        store_id: webhookData.store_id,
        scope: webhookData.scope,
        data: webhookData.data,
        category: Category.B2C, // Regular BigCommerce webhooks are B2C
      });

      await bigCommerceData.save();
      this.logger.log(`BigCommerce webhook data saved to database with ID: ${bigCommerceData._id}`);
    } catch (error) {
      this.logger.error(`Error saving BigCommerce webhook to database: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Handle customer webhook events
   */
  private async handleCustomer(webhookData: any): Promise<void> {
    this.logger.log(`Processing BigCommerce customer data: ${JSON.stringify(webhookData.data, null, 2)}`);
    
    // TODO: Implement customer synchronization logic
    
    this.logger.log(`BigCommerce customer data processed successfully`);
  }

  /**
   * Handle order webhook events
   */
  private async handleOrder(webhookData: any): Promise<void> {
    this.logger.log(`Processing BigCommerce order data: ${JSON.stringify(webhookData.data, null, 2)}`);
    
    const storeHash = this.configService.bigCommerceStoreHash;
    const token = this.configService.bigCommerceToken;
    const orderId = webhookData.data.id;

    try {
      const order = await getOrderById(storeHash, orderId, token);
      
      if (order.status !== 'Incomplete') {
        await this.saveWebhookToDatabase(webhookData);

        // Queue the webhook for processing by the BigCommerce module
        const job = await this.jobQueueService.addJob({
          type: 'bigcommerce',
          payload: webhookData,
          priority: 5, // Lower priority for BigCommerce
          metadata: {
            platform: 'bigcommerce',
            scope: webhookData.scope,
            receivedAt: new Date().toISOString(),
          },
        });

        this.logger.log(`BigCommerce order data queued for processing with job ID: ${job.id}`);

      }
    } catch (error) {
      this.logger.error(`Error fetching order details: ${error.message}`, error.stack);
      throw error;
    }
    
    this.logger.log(`BigCommerce order data processed successfully`);
  }

  /**
   * Handle product webhook events
   */
  private async handleProduct(webhookData: any): Promise<void> {
    this.logger.log(`Processing BigCommerce product data: ${JSON.stringify(webhookData.data, null, 2)}`);
    
    // TODO: Implement product synchronization logic
    
    this.logger.log(`BigCommerce product data processed successfully`);
  }

  /**
   * Handle generic webhook events
   */
  private async handleGeneric(webhookData: any): Promise<void> {
    this.logger.log(`Processing generic BigCommerce webhook data: ${JSON.stringify(webhookData, null, 2)}`);
    
    // TODO: Implement generic webhook handling logic
    
    this.logger.log(`Generic BigCommerce webhook data processed successfully`);
  }

  /**
   * Get BigCommerce data from database
   */
  async getBigCommerceData(filter: any = {}): Promise<BigCommerceDocument[]> {
    try {
      return await this.bigCommerceModel.find(filter).exec();
    } catch (error) {
      this.logger.error(`Error fetching BigCommerce data: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get BigCommerce data by ID
   */
  async getBigCommerceDataById(id: string): Promise<BigCommerceDocument | null> {
    try {
      return await this.bigCommerceModel.findById(id).exec();
    } catch (error) {
      this.logger.error(`Error fetching BigCommerce data by ID: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Process Acumatica handler (redis)
   */
  async processHandler(data: any): Promise<void> {
    this.logger.log(`Processing BigCommerce: ${JSON.stringify(data)}`, 'BigCommerceService');
  }
}
