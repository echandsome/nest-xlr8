import { Controller, Get, Post, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { B2BBigCommerceService } from './b2b-bigcommerce.service';
import { CustomLoggerService } from '@/core/logger/logger.service';

@ApiTags('B2B BigCommerce')
@Controller('b2b-bigcommerce')
export class B2BBigCommerceController {
  constructor(
    private readonly b2bBigCommerceService: B2BBigCommerceService,
    private readonly logger: CustomLoggerService
  ) {}


}
