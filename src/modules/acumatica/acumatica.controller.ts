import { Controller, Get, Post, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AcumaticaService } from './acumatica.service';
import { CustomLoggerService } from '@/core/logger/logger.service';

@ApiTags('Acumatica')
@Controller('acumatica')
export class AcumaticaController {
  constructor(
    private readonly acumaticaService: AcumaticaService,
    private readonly logger: CustomLoggerService
  ) {}

  
}
