import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Request, Response } from 'express';
import { CustomLoggerService } from '@/core/logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: CustomLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const { method, url, ip, headers } = request;
    const userAgent = headers['user-agent'] || '';
    const now = Date.now();

    this.logger.logRequest(method, url, ip || 'unknown', userAgent, LoggingInterceptor.name);

    return next.handle().pipe(
      tap(() => {
        const { statusCode } = response;
        const contentLength = parseInt(response.get('content-length') || '0', 10);
        const responseTime = Date.now() - now;
        
        this.logger.logResponse(method, url, statusCode, contentLength, responseTime, LoggingInterceptor.name);
      }),
      catchError((error) => {
        const responseTime = Date.now() - now;
        this.logger.logError(method, url, error.message, responseTime, LoggingInterceptor.name);
        return throwError(() => error);
      }),
    );
  }
}
