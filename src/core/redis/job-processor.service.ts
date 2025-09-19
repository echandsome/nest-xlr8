import { Injectable } from '@nestjs/common';
import { JobData } from './job-queue.service';
import { CustomLoggerService } from '@/core/logger/logger.service';
import { BigCommerceService } from '@/modules/bigcommerce/bigcommerce.service';
import { B2BBigCommerceService } from '@/modules/b2b-bigcommerce/b2b-bigcommerce.service';
import { AcumaticaService } from '@/modules/acumatica/acumatica.service';

@Injectable()
export class JobProcessorService {
  private processors: Map<string, (data: JobData) => Promise<void>> = new Map();

  constructor(
    private logger: CustomLoggerService,
    private bigCommerceService: BigCommerceService,
    private b2bBigCommerceService: B2BBigCommerceService,
    private acumaticaService: AcumaticaService,
  ) {
    this.registerDefaultProcessors();
  }

  /**
   * Register a job processor for a specific job type
   */
  registerProcessor(jobType: string, processor: (data: JobData) => Promise<void>) {
    this.processors.set(jobType, processor);
    this.logger.log(`Processor registered for job type: ${jobType}`, 'JobProcessorService');
  }

  /**
   * Process a job based on its type
   */
  async processJob(job: any) {
    const data: JobData = job.data;
    
    try {
      this.logger.log(`Processing job ${job.id} of type: ${data.type}`, 'JobProcessorService');

      const processor = this.processors.get(data.type);
      if (!processor) {
        throw new Error(`No processor found for job type: ${data.type}`);
      }

      await processor(data);
      this.logger.log(`Job ${job.id} (${data.type}) processed successfully`, 'JobProcessorService');
    } catch (error) {
      this.logger.error(`Job ${job.id} (${data.type}) failed: ${error.message}`, error.stack, 'JobProcessorService');
      throw error; // This will mark the job as failed
    }
  }

  /**
   * Register default processors for common job types
   */
  private registerDefaultProcessors() {
    // processors
    this.registerProcessor('bigcommerce', this.processBigCommerce.bind(this));
    this.registerProcessor('b2b-bigcommerce', this.processB2BBigCommerce.bind(this));
    this.registerProcessor('acumatica', this.processAcumatica.bind(this));
    this.logger.log('Default job processors registered', 'JobProcessorService');
  }

  // Processors
  private async processBigCommerce(data: JobData) {
    this.logger.log(`Processing BigCommerce: ${JSON.stringify(data.payload)}`, 'JobProcessorService');
    
    try {
      await this.bigCommerceService.processHandler(data.payload);
      this.logger.log('BigCommerce processed successfully', 'JobProcessorService');
    } catch (error) {
      this.logger.error(`BigCommerce processing failed: ${error.message}`, error.stack, 'JobProcessorService');
      throw error;
    }
  }

  private async processB2BBigCommerce(data: JobData) {
    this.logger.log(`Processing B2B BigCommerce: ${JSON.stringify(data.payload)}`, 'JobProcessorService');
    
    try {
      await this.b2bBigCommerceService.processHandler(data.payload);
      this.logger.log('B2B BigCommerce processed successfully', 'JobProcessorService');
    } catch (error) {
      this.logger.error(`B2B BigCommerce processing failed: ${error.message}`, error.stack, 'JobProcessorService');
      throw error;
    }
  }

  private async processAcumatica(data: JobData) {
    this.logger.log(`Processing Acumatica: ${JSON.stringify(data.payload)}`, 'JobProcessorService');
    
    try {
      await this.acumaticaService.processHandler(data.payload);
      this.logger.log('Acumatica processed successfully', 'JobProcessorService');
    } catch (error) {
      this.logger.error(`Acumatica processing failed: ${error.message}`, error.stack, 'JobProcessorService');
      throw error;
    }
  }

}
