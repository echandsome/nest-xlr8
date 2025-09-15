import { Injectable, LoggerService, Global } from '@nestjs/common';
import { ConfigService } from '@/core/config/config.service';
import * as winston from 'winston';
import * as path from 'path';
import 'winston-daily-rotate-file';

@Global()
@Injectable()
export class CustomLoggerService implements LoggerService {
  private readonly logger: winston.Logger;

  constructor(private configService: ConfigService) {
    this.logger = this.createWinstonLogger();
  }

  private createWinstonLogger(): winston.Logger {
    const logDir = this.configService.logDir;
    const logLevel = this.configService.logLevel;
    const maxFiles = this.configService.logMaxFiles;
    const maxSize = this.configService.logMaxSize;

    // Create log directory if it doesn't exist
    const fs = require('fs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    // Custom level filter - ensures only logs of specific level go to each file
    // This is the key to ensuring errors of the same level are stored in a single file
    const levelFilter = (level: string) =>
      winston.format((info) => {
        return info.level === level ? info : false;
      })();

    const logFormat = winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.errors({ stack: true }),
      winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
        const contextStr = context ? `[${context}] ` : '';
        const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
        return `${timestamp} ${level}: ${contextStr}${message}${metaStr}`;
      }),
    );

    const consoleFormat = winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
        const contextStr = context ? `[${context}] ` : '';
        const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
        return `${timestamp} ${level}: ${contextStr}${message}${metaStr}`;
      }),
    );

    const transports: winston.transport[] = [
      // Console transport
      new winston.transports.Console({
        level: logLevel,
        format: consoleFormat,
      }),
    ];

    // Production: Separate files for different log levels
    // Each transport will only write logs of its specific level using levelFilter
    transports.push(
      new winston.transports.File({
        filename: path.join(logDir, 'error.log'),
        format: winston.format.combine(
          levelFilter('error'),
          logFormat
        ),
        maxsize: this.parseSize(maxSize),
        maxFiles: maxFiles,
      }),
      new winston.transports.File({
        filename: path.join(logDir, 'warn.log'),
        format: winston.format.combine(
          levelFilter('warn'),
          logFormat
        ),
        maxsize: this.parseSize(maxSize),
        maxFiles: maxFiles,
      }),
      new winston.transports.File({
        filename: path.join(logDir, 'info.log'),
        format: winston.format.combine(
          levelFilter('info'),
          logFormat
        ),
        maxsize: this.parseSize(maxSize),
        maxFiles: maxFiles,
      }),
      new winston.transports.File({
        filename: path.join(logDir, 'debug.log'),
        format: winston.format.combine(
          levelFilter('debug'),
          logFormat
        ),
        maxsize: this.parseSize(maxSize),
        maxFiles: maxFiles,
      }),
      new winston.transports.File({
        filename: path.join(logDir, 'verbose.log'),
        format: winston.format.combine(
          levelFilter('verbose'),
          logFormat
        ),
        maxsize: this.parseSize(maxSize),
        maxFiles: maxFiles,
      }),
    );

    return winston.createLogger({
      level: logLevel,
      format: logFormat,
      transports,
      exitOnError: false,
    });
  }

  private parseSize(size: string): number {
    const units: { [key: string]: number } = {
      b: 1,
      k: 1024,
      m: 1024 * 1024,
      g: 1024 * 1024 * 1024,
    };
    const match = size.toLowerCase().match(/^(\d+(?:\.\d+)?)\s*(b|k|m|g)$/);
    if (!match) return 20 * 1024 * 1024; // Default 20MB
    return parseFloat(match[1]) * units[match[2]];
  }

  log(message: any, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: any, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: any, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: any, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: any, context?: string) {
    this.logger.verbose(message, { context });
  }

  // Additional methods for structured logging
  logRequest(method: string, url: string, ip: string, userAgent: string, context?: string) {
    this.logger.info(`Incoming Request: ${method} ${url} - ${ip} - ${userAgent}`, {
      context: context || 'HTTP',
    });
  }

  logResponse(method: string, url: string, statusCode: number, contentLength: number, responseTime: number, context?: string) {
    this.logger.info(`Outgoing Response: ${method} ${url} - ${statusCode} - ${contentLength}b - ${responseTime}ms`, {
      context: context || 'HTTP',
    });
  }

  logError(method: string, url: string, error: string, responseTime: number, context?: string) {
    this.logger.error(`Request Failed: ${method} ${url} - ${error} - ${responseTime}ms`, {
      context: context || 'HTTP',
    });
  }
}
