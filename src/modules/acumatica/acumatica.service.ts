import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CustomLoggerService } from '@/core/logger/logger.service';
import { ConfigService } from '@/core/config/config.service';
import { JobQueueService } from '@/core/redis/job-queue.service';
import axios from 'axios';
import { ICAcumaticaCustomer, IAcumaticaCustomer } from '@/shared/interfaces';

@Injectable()
export class AcumaticaService {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: CustomLoggerService,
    private readonly jobQueueService: JobQueueService,
  ) {}

  /**
   * Create an axios instance with the given cookies
   */
  private createAxiosInstance(cookies: string[]) {
    return axios.create({
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookies.join('; ')
        },
        withCredentials: true
    });
  }

  /**
   * Extract cookies from the headers
   */
  private extractCookies(headers: any): string[] {
    const cookies: string[] = [];
    const setCookieHeaders = headers['set-cookie'];
    
    if (Array.isArray(setCookieHeaders)) {
        setCookieHeaders.forEach(cookie => {
            // Extract the cookie name and value
            const cookieMatch = cookie.match(/^([^=]+)=([^;]+)/);
            if (cookieMatch) {
                cookies.push(`${cookieMatch[1]}=${cookieMatch[2]}`);
            }
        });
    }
    
    return cookies;
  }

  /**
   * Logout from Acumatica
   */
  async logout(cookies?: string[]) {
    const url = `${this.configService.acumaticaInstanceUri}/entity/auth/logout`;
    const axiosInstance = cookies ? this.createAxiosInstance(cookies) : axios;
    
    await axiosInstance.post(url, {
        name: this.configService.acumaticaUsername,
        password: this.configService.acumaticaPassword,
        company: this.configService.acumaticaCompany
    }, {
        withCredentials: true
    });
  }

  /**
   * Login to Acumatica
   */
  private async login() {
    const url = `${this.configService.acumaticaInstanceUri}/entity/auth/login`;
    const response = await axios.post(url, {
        name: this.configService.acumaticaUsername,
        password: this.configService.acumaticaPassword,
        company: this.configService.acumaticaCompany
    }, {
        withCredentials: true
    });
    return response;
  }

  /**
   * Test Acumatica connection
   */
  async testConnection(userId: string) {
    try {
        const loginResponse = await this.login();
        const cookies = this.extractCookies(loginResponse.headers);

        console.log(cookies)

        await this.logout(cookies);

        return loginResponse.data;
    } catch (error: any) {
        throw error;
    }
  }  

  async getQueryTemplate(endpoint: string, method: string = 'get', data: any = null) {
    let cookies: string[] = [];
    try {
      const loginResponse = await this.login();
      cookies = this.extractCookies(loginResponse.headers);

      if (!cookies) {
        throw new Error('No cookies found');
      }

      const instanceUri = this.configService.acumaticaInstanceUri;
      const endpointName = this.configService.acumaticaEndpointName;
      const apiVersion = this.configService.acumaticaApiVersion;

      const url = `${instanceUri}/entity/${endpointName}/${apiVersion}/${endpoint}`;
      const axiosInstance = this.createAxiosInstance(cookies);
      let response;
      if (method === 'get') {
        response = await axiosInstance.get(url);
      } else if (method === 'put') {
        response = await axiosInstance.put(url, data);
      } else {
        throw new Error('Invalid method');
      }

      await this.logout(cookies);

      return response.data;
    } catch (error: any) {
      console.log(JSON.stringify(error.response.data));
      if (cookies) {
        try {
          await this.logout(cookies);
        } catch (error: any) {
          this.logger.error(`Error logging out from Acumatica: ${error.message}`, error.stack);
        }
      }
      throw error;
    }
  }

  async getCustomers(params: string = '') {
    const endpoint = `Customer${params}`;
    const customers = await this.getQueryTemplate(endpoint, 'get');
    return customers;
  }

  async getCustomerByEmail(email: string): Promise<IAcumaticaCustomer | null> {
    const customers = await this.getCustomers(`?$filter=Email eq '${email}'`);
    return customers.length > 0 ? customers[0] : null;
  }

  async createCustomer(customer: ICAcumaticaCustomer): Promise<IAcumaticaCustomer> {
    return this.getQueryTemplate('Customer', 'put', customer);
  }

  async getInventoryItems(params: string = '') {
    const endpoint = `StockItem/${params}`;
    const inventoryItems = await this.getQueryTemplate(endpoint, 'get');
    return inventoryItems;
  }

  async getInventoryItemBySku(sku: string) {
    const inventoryItems = await this.getInventoryItems(`?$filter=InventoryID eq '${sku}'`);
    return inventoryItems.length > 0 ? inventoryItems[0] : null;
  }

  async createInventoryItem(inventoryItem: any) {
    const createdInventoryItem = await this.getQueryTemplate('StockItem', 'put', inventoryItem);
    return createdInventoryItem;
  }

  async getItemClasses() {
    const itemClasses = await this.getQueryTemplate('ItemClass', 'get');
    return itemClasses;
  }

  async createItemClass(itemClass: any) {
    const createdItemClass = await this.getQueryTemplate('ItemClass', 'put', itemClass);
    return createdItemClass;
  }

  /**
   * Process Acumatica webhook data from job queue
   */
  async processWebhook(webhookData: any): Promise<void> {

    try {
      const entityType = webhookData.entityType || 'unknown';
      const eventType = webhookData.eventType || 'unknown';
      
      switch (entityType) {
        case 'Customer':
          await this.handleCustomer(webhookData);
          break;
        case 'SalesOrder':
          await this.handleOrder(webhookData);
          break;
        case 'InventoryItem':
          await this.handleProduct(webhookData);
          break;
        default:
          this.logger.warn(`Unhandled Acumatica webhook entity type: ${entityType}`);
          await this.handleGeneric(webhookData);
      }
    } catch (error) {
      this.logger.error(`Error processing Acumatica webhook: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Handle Acumatica customer webhook events
   */
  private async handleCustomer(webhookData: any): Promise<void> {
    this.logger.log(`Processing Acumatica customer data (${webhookData.eventType}): ${JSON.stringify(webhookData.data, null, 2)}`);
    
    // TODO: Implement Acumatica customer synchronization logic
    
    this.logger.log(`Acumatica customer data processed successfully`);
  }

  /**
   * Handle Acumatica order webhook events
   */
  private async handleOrder(webhookData: any): Promise<void> {
    this.logger.log(`Processing Acumatica order data (${webhookData.eventType}): ${JSON.stringify(webhookData.data, null, 2)}`);
    
    // Queue the webhook for processing by the Acumatica module
    const job = await this.jobQueueService.addJob({
      type: 'acumatica',
      payload: webhookData,
      priority: 5, // Lower priority for Acumatica
      metadata: {
        platform: 'acumatica',
        entityType: webhookData.entityType,
        eventType: webhookData.eventType,
        receivedAt: new Date().toISOString(),
      },
    });

    this.logger.log(`Acumatica order data processed successfully`);
  }

  /**
   * Handle Acumatica product webhook events
   */
  private async handleProduct(webhookData: any): Promise<void> {
    this.logger.log(`Processing Acumatica product data (${webhookData.eventType}): ${JSON.stringify(webhookData.data, null, 2)}`);
    
    // TODO: Implement Acumatica product synchronization logic
    
    this.logger.log(`Acumatica product data processed successfully`);
  }

  /**
   * Handle generic Acumatica webhook events
   */
  private async handleGeneric(webhookData: any): Promise<void> {
    this.logger.log(`Processing generic Acumatica webhook data: ${JSON.stringify(webhookData, null, 2)}`);
    
    // TODO: Implement generic Acumatica webhook handling logic
    
    this.logger.log(`Generic Acumatica webhook data processed successfully`);
  }

  /**
   * Process Acumatica handler (redis)
   */
  async processHandler(data: any): Promise<void> {

    // const inventoryItems = await this.getInventoryItems();
    // this.logger.log(`Acumatica inventory items: ${JSON.stringify(inventoryItems)}`, 'AcumaticaService');

    // const inventoryItem = {
    //   "InventoryID": {
    //     "value": "NEWITEMW"
    //   },
    //   "Description": {
    //     "value": "New Item Description"
    //   },
    //   "ItemClass": {
    //     "value": "NEWCLASS"
    //   },
    //   "ItemStatus": {
    //     "value": "Active"
    //   },
    //   "PostingClass": {
    //     "value": "AOL"
    //   },
    //   "TaxCategory": {
    //     "value": "EXEMPT"
    //   }
    // };

    // const createdInventoryItem = await this.createInventoryItem(inventoryItem);
    // this.logger.log(`Acumatica inventory item created: ${JSON.stringify(createdInventoryItem)}`, 'AcumaticaService');

    // const itemClasses = await this.getItemClasses();
    // this.logger.log(`Acumatica item classes: ${JSON.stringify(itemClasses)}`, 'AcumaticaService');

    // const itemClass = {
    //   "ClassID": {
    //     "value": "NEWCLASS"
    //   },
    //   "Description": {
    //     "value": "New Item Class for Widgets"
    //   },
    //   "ItemType": {
    //     "value": "Finished Good"
    //   },
    //   "AvailabilityCalculationRule": {
    //     "value": "ALLOTHER"
    //   },
    //   "BaseUOM": {
    //     "value": "PIECE"
    //   },
    //   "PurchaseUOM": {
    //     "value": "PIECE"
    //   },
    //   "SalesUOM": {
    //     "value": "PIECE"
    //   }
    // }

    // const createdItemClass = await this.createItemClass(itemClass);
    // this.logger.log(`Acumatica item class created: ${JSON.stringify(createdItemClass)}`, 'AcumaticaService');
  }

}
