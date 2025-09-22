import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BigCommerce, BigCommerceDocument, Category } from '@/core/database/schemas/bigcommerce.schema';
import { CustomLoggerService } from '@/core/logger/logger.service';
import { ConfigService } from '@/core/config/config.service';
import { getOrderById } from '@/shared/apis/bigcommerce';
import { JobQueueService } from '@/core/redis/job-queue.service';

@Injectable()
export class B2BBigCommerceService {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: CustomLoggerService,
    private readonly jobQueueService: JobQueueService,
    @InjectModel(BigCommerce.name) private bigCommerceModel: Model<BigCommerceDocument>,
  ) {}

  /**
   * Process B2B BigCommerce webhook data from job queue
   */
  async processWebhook(webhookData: any): Promise<void> {
    this.logger.log(`Processing B2B BigCommerce webhook: ${webhookData.scope || 'unknown'}`);

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
          this.logger.warn(`Unhandled B2B BigCommerce webhook scope: ${scope}`);
          await this.handleGeneric(webhookData);
      }
    } catch (error) {
      this.logger.error(`Error processing B2B BigCommerce webhook: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Save B2B webhook data to database
   */
  async saveWebhookToDatabase(webhookData: any): Promise<void> {
    try {
      const bigCommerceData = new this.bigCommerceModel({
        producer: webhookData.producer,
        hash: webhookData.hash,
        store_id: webhookData.store_id,
        scope: webhookData.scope,
        data: webhookData.data,
        category: Category.B2B, // B2B BigCommerce webhooks are B2B
      });

      await bigCommerceData.save();
      this.logger.log(`B2B BigCommerce webhook data saved to database with ID: ${bigCommerceData._id}`);
    } catch (error) {
      this.logger.error(`Error saving B2B BigCommerce webhook to database: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Handle B2B customer webhook events
   */
  private async handleCustomer(webhookData: any): Promise<void> {
    this.logger.log(`Processing B2B BigCommerce customer data: ${JSON.stringify(webhookData.data, null, 2)}`);
    
    // TODO: Implement B2B customer synchronization logic
    
    this.logger.log(`B2B BigCommerce customer data processed successfully`);
  }

  /**
   * Handle B2B order webhook events
   */
  private async handleOrder(webhookData: any): Promise<void> {
    this.logger.log(`Processing B2B BigCommerce order data: ${JSON.stringify(webhookData.data, null, 2)}`);
    
    const storeHash = this.configService.bigCommerceStoreHash;
    const token = this.configService.bigCommerceToken;
    const orderId = webhookData.data.id;

    try {
      const order = await getOrderById(storeHash, orderId, token);
      
      if (order.status !== 'Incomplete') {
        await this.saveWebhookToDatabase(webhookData);
        
        // Queue the webhook for processing by the B2B BigCommerce module
        const job = await this.jobQueueService.addJob({
          type: 'b2b-bigcommerce',
          payload: webhookData,
          priority: 5, // Lower priority for B2B BigCommerce
          metadata: {
            platform: 'bigcommerce',
            scope: webhookData.scope,
            receivedAt: new Date().toISOString(),
          },
        });
      }
    } catch (error) {
      this.logger.error(`Error fetching B2B order details: ${error.message}`, error.stack);
      throw error;
    }
    
    this.logger.log(`B2B BigCommerce order data processed successfully`);
  }

  /**
   * Handle B2B product webhook events
   */
  private async handleProduct(webhookData: any): Promise<void> {
    this.logger.log(`Processing B2B BigCommerce product data: ${JSON.stringify(webhookData.data, null, 2)}`);
    
    // TODO: Implement B2B product synchronization logic
    
    this.logger.log(`B2B BigCommerce product data processed successfully`);
  }

  /**
   * Handle generic B2B webhook events
   */
  private async handleGeneric(webhookData: any): Promise<void> {
    this.logger.log(`Processing generic B2B BigCommerce webhook data: ${JSON.stringify(webhookData, null, 2)}`);
    
    // TODO: Implement generic B2B webhook handling logic
    
    this.logger.log(`Generic B2B BigCommerce webhook data processed successfully`);
  }

  /**
   * Get B2B BigCommerce data from database
   */
  async getB2BBigCommerceData(filter: any = {}): Promise<BigCommerceDocument[]> {
    try {
      const b2bFilter = { ...filter, category: Category.B2B };
      return await this.bigCommerceModel.find(b2bFilter).exec();
    } catch (error) {
      this.logger.error(`Error fetching B2B BigCommerce data: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get B2B BigCommerce data by ID
   */
  async getB2BBigCommerceDataById(id: string): Promise<BigCommerceDocument | null> {
    try {
      return await this.bigCommerceModel.findOne({ _id: id, category: Category.B2B }).exec();
    } catch (error) {
      this.logger.error(`Error fetching B2B BigCommerce data by ID: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Process Acumatica handler (redis)
   */
  async processHandler(data: any): Promise<void> {
    this.logger.log(`Processing B2B BigCommerce: ${JSON.stringify(data)}`, 'B2BBigCommerceService');
  }
}
