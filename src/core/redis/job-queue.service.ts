import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@/core/config/config.service';
import { CustomLoggerService } from '@/core/logger/logger.service';
import Bull from 'bull';

export interface JobData {
  type: string;
  payload: any;
  priority?: number;
  delay?: number;
  attempts?: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

@Injectable()
export class JobQueueService implements OnModuleInit, OnModuleDestroy {
  private jobQueue: Bull.Queue<JobData>;

  constructor(
    private configService: ConfigService,
    private logger: CustomLoggerService,
  ) {}

  async onModuleInit() {
    await this.initializeQueue();
  }

  async onModuleDestroy() {
    await this.jobQueue?.close();
  }

  private async initializeQueue() {
    // Create generic job processing queue
    this.jobQueue = new Bull('job-processing', {
      redis: {
        host: this.configService.redisHost,
        port: this.configService.redisPort,
        password: this.configService.redisPassword || undefined,
        db: this.configService.redisDb,
      },
      defaultJobOptions: {
        removeOnComplete: 100, // Keep last 100 completed jobs
        removeOnFail: 50, // Keep last 50 failed jobs
        attempts: 3, // Retry failed jobs 3 times
        backoff: {
          type: 'exponential',
          delay: 2000, // Start with 2 second delay
        },
      },
    });

    // Set up queue event listeners
    this.jobQueue.on('completed', (job) => {
      this.logger.log(`Job ${job.id} (${job.data.type}) completed`, 'JobQueueService');
    });

    this.jobQueue.on('failed', (job, err) => {
      this.logger.error(`Job ${job.id} (${job.data.type}) failed: ${err.message}`, err.stack, 'JobQueueService');
    });

    this.jobQueue.on('stalled', (job) => {
      this.logger.warn(`Job ${job.id} (${job.data.type}) stalled`, 'JobQueueService');
    });

    this.logger.log('Job queue initialized', 'JobQueueService');
  }

  /**
   * Add a job to the queue
   */
  async addJob(jobData: Omit<JobData, 'timestamp'>, options?: Bull.JobOptions): Promise<Bull.Job<JobData>> {
    try {
      const job: JobData = {
        ...jobData,
        timestamp: new Date(),
        priority: jobData.priority || 1,
        attempts: jobData.attempts || 3,
      };

      const bullJob = await this.jobQueue.add('process-job', job, {
        priority: job.priority,
        delay: jobData.delay || 0,
        ...options,
      });

      this.logger.log(`Job ${bullJob.id} (${job.type}) queued`, 'JobQueueService');
      return bullJob;
    } catch (error) {
      this.logger.error(`Failed to queue job: ${error.message}`, error.stack, 'JobQueueService');
      throw error;
    }
  }

  /**
   * Add a delayed job to the queue
   */
  async addDelayedJob(jobData: Omit<JobData, 'timestamp'>, delay: number, options?: Bull.JobOptions): Promise<Bull.Job<JobData>> {
    return this.addJob(jobData, { delay, ...options });
  }

  /**
   * Get queue statistics
   */
  async getQueueStats() {
    try {
      const [waiting, active, completed, failed, delayed] = await Promise.all([
        this.jobQueue.getWaiting(),
        this.jobQueue.getActive(),
        this.jobQueue.getCompleted(),
        this.jobQueue.getFailed(),
        this.jobQueue.getDelayed(),
      ]);

      return {
        waiting: waiting.length,
        active: active.length,
        completed: completed.length,
        failed: failed.length,
        delayed: delayed.length,
      };
    } catch (error) {
      this.logger.error(`Failed to get queue stats: ${error.message}`, error.stack, 'JobQueueService');
      throw error;
    }
  }

  /**
   * Get a job by ID
   */
  async getJobById(jobId: string): Promise<Bull.Job<JobData> | null> {
    try {
      return await this.jobQueue.getJob(jobId);
    } catch (error) {
      this.logger.error(`Failed to get job ${jobId}: ${error.message}`, error.stack, 'JobQueueService');
      return null;
    }
  }

  /**
   * Retry a failed job
   */
  async retryJob(jobId: string): Promise<void> {
    try {
      const job = await this.getJobById(jobId);
      if (job) {
        await job.retry();
        this.logger.log(`Job ${jobId} retried`, 'JobQueueService');
      }
    } catch (error) {
      this.logger.error(`Failed to retry job ${jobId}: ${error.message}`, error.stack, 'JobQueueService');
      throw error;
    }
  }

  /**
   * Clean completed and failed jobs
   */
  async cleanQueue(grace: number = 5000): Promise<void> {
    try {
      await this.jobQueue.clean(grace, 'completed');
      await this.jobQueue.clean(grace, 'failed');
      this.logger.log('Queue cleaned', 'JobQueueService');
    } catch (error) {
      this.logger.error(`Failed to clean queue: ${error.message}`, error.stack, 'JobQueueService');
      throw error;
    }
  }

  /**
   * Get the Bull queue instance
   */
  getQueue(): Bull.Queue<JobData> {
    return this.jobQueue;
  }
}
