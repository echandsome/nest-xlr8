import { Injectable } from '@nestjs/common';
import { JobQueueService, JobData } from './job-queue.service';
import { CustomLoggerService } from '@/core/logger/logger.service';

@Injectable()
export class JobProcessorService {
  private processors: Map<string, (data: JobData) => Promise<void>> = new Map();

  constructor(
    private jobQueueService: JobQueueService,
    private logger: CustomLoggerService,
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
    // Webhook processors
    this.registerProcessor('webhook-bigcommerce', this.processBigCommerceWebhook.bind(this));
    this.registerProcessor('webhook-b2b-bigcommerce', this.processB2BBigCommerceWebhook.bind(this));
    this.registerProcessor('webhook-acumatica', this.processAcumaticaWebhook.bind(this));
    this.logger.log('Default job processors registered', 'JobProcessorService');
  }

  // Webhook Processors
  private async processBigCommerceWebhook(data: JobData) {
    this.logger.log(`Processing BigCommerce webhook: ${JSON.stringify(data.payload)}`, 'JobProcessorService');
    
    // Simulate processing time
    await this.simulateProcessing(1000, 3000);
    
    // Here you would implement your actual BigCommerce webhook processing logic
    
    this.logger.log('BigCommerce webhook processed successfully', 'JobProcessorService');
  }

  private async processB2BBigCommerceWebhook(data: JobData) {
    this.logger.log(`Processing B2B BigCommerce webhook: ${JSON.stringify(data.payload)}`, 'JobProcessorService');
    
    // Simulate processing time
    await this.simulateProcessing(1500, 4000);
    
    // Here you would implement your actual B2B BigCommerce webhook processing logic
    this.logger.log('B2B BigCommerce webhook processed successfully', 'JobProcessorService');
  }

  private async processAcumaticaWebhook(data: JobData) {
    this.logger.log(`Processing Acumatica webhook: ${JSON.stringify(data.payload)}`, 'JobProcessorService');
    
    // Simulate processing time
    await this.simulateProcessing(2000, 5000);
    
    // Here you would implement your actual Acumatica webhook processing logic
    this.logger.log('Acumatica webhook processed successfully', 'JobProcessorService');
  }

  private async simulateProcessing(minMs: number, maxMs: number): Promise<void> {
    const delay = Math.random() * (maxMs - minMs) + minMs;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Simulate occasional failures for testing
    if (Math.random() < 0.1) {
      throw new Error('Simulated processing failure');
    }
  }
}
