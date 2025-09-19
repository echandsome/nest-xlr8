import { Controller, Get, Post, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { BigCommerceService } from './bigcommerce.service';
import { CustomLoggerService } from '@/core/logger/logger.service';

@ApiTags('BigCommerce')
@Controller('bigcommerce')
export class BigCommerceController {
  constructor(
    private readonly bigCommerceService: BigCommerceService,
    private readonly logger: CustomLoggerService
  ) {}

  
}
