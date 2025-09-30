import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BigCommerce, BigCommerceDocument, Category, Status } from '@/core/database/schemas/bigcommerce.schema';
import { CustomLoggerService } from '@/core/logger/logger.service';
import { ConfigService } from '@/core/config/config.service';
import { getOrderById, getCustomerById, getCustomerAddressById, getProductById } from '@/shared/apis/bigcommerce.api';
import { JobQueueService } from '@/core/redis/job-queue.service';
import { AcumaticaService } from '../acumatica/acumatica.service';
import { ICAcumaticaCustomer } from '@/shared/interfaces';
import { formatCountryCode } from '@/shared/utils/helper';

@Injectable()
export class BigCommerceService {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: CustomLoggerService,
    private readonly jobQueueService: JobQueueService,
    private readonly acumaticaService: AcumaticaService,
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
  async saveWebhookToDatabase(webhookData: any): Promise<BigCommerceDocument> {
    try {
      const bigCommerceData = new this.bigCommerceModel({
        producer: webhookData.producer,
        hash: webhookData.hash,
        store_id: webhookData.store_id,
        scope: webhookData.scope,
        data: webhookData.data,
        category: Category.B2C, // Regular BigCommerce webhooks are B2C
        status: Status.PENDING,
      });

      const savedData = await bigCommerceData.save();
      this.logger.log(`BigCommerce webhook data saved to database with ID: ${bigCommerceData._id}`);
      return savedData;
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
        const savedData = await this.saveWebhookToDatabase(webhookData);

        // Queue the webhook for processing by the BigCommerce module
        const job = await this.jobQueueService.addJob({
          type: 'bigcommerce',
          payload: { ...webhookData, id: savedData._id },
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
    console.log(data);
    await this.bigCommerceModel.updateOne({ _id: data.id }, { $set: { status: Status.PROCESSING } });

    const storeHash = this.configService.bigCommerceStoreHash;
    const token = this.configService.bigCommerceToken;
    const orderId = data.data.id;

    const order = await getOrderById(storeHash, orderId, token);
    const customer = await getCustomerById(storeHash, order.customer_id, token);
    const customerAddress = await getCustomerAddressById(storeHash, order.customer_id, token);
    const products = await getProductById(storeHash, orderId, token);

    const email = customer.email;

    // console.log(email)

    let acustomer = await this.acumaticaService.getCustomerByEmail(email);

    if (!acustomer) {
      const customerName = customer.first_name + '' + customer.last_name;
      const customerClassID = customerName.toUpperCase();
      const address1 = customerAddress.address1;
      const address2 = customerAddress.address2;
      const city = customerAddress.city;
      const state = customerAddress.state_or_province;
      const postalCode = customerAddress.postal_code;
      const country = customerAddress.country;
      const countryCode = await formatCountryCode(country, this.configService.apiNinjasApiKey);
      const company = customer.company ? 'Organization' : 'Individual';

      const accustomer: ICAcumaticaCustomer = {
        CustomerID: {
          "value": customerClassID
        },
        "CustomerName": {
          "value": customerName
        },
        "CustomerClassID": {
          "value": "DEFAULT"
        },
        "CustomerCategory": {
          "value": company
        },
        "Email": {
          "value": email
        },
        "MainContact": {
          "Address": {
            "AddressLine1": {
              "value": address1
            },
            "AddressLine2": {
              "value": address2
            },
            "City": {
              "value": city
            },
            "State": {
              "value": state
            },
            "PostalCode": {
              "value": postalCode
            },
            "Country": {
              "value": countryCode
            }
          }
        }
      }
      acustomer = await this.acumaticaService.createCustomer(accustomer);
    }

    // this.logger.log(JSON.stringify(acustomer, null, 2));

    products.forEach(async (product) => {
      const inventoryItem = await this.acumaticaService.getInventoryItemBySku(product.sku);
      if (!inventoryItem) {
        // const acproduct = {
        //   "InventoryID": {
        //     "value": product.sku
        //   },
        //   "Description": {
        //     "value": product.name
        //   },
        //   "ItemStatus": {
        //     "value": "Active"
        //   },
        //   "ItemClass": {
        //     "value": "NEWCLASS"
        //   },
        //   "PostingClass": {
        //     "value": "AOL"
        //   },
        //   "TaxCategory": {
        //     "value": "EXEMPT"
        //   }
        // }
        // const inventoryItem = await this.acumaticaService.createInventoryItem(acproduct);
        // this.logger.log(JSON.stringify(inventoryItem, null, 2));
      }
      console.log('---', inventoryItem);
    });

   
  }
}
