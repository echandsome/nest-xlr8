import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsObject, IsOptional, IsNumber } from 'class-validator';

export class BigCommerceWebhookDto {
  @ApiProperty({ description: 'BigCommerce Webhook producer', example: 'stores/0l7iydr17j' })
  @IsString()
  producer: string;

  @ApiProperty({ description: 'BigCommerce Webhook hash', example: '3b0ac53d4d6a3965f73e779a854dfc0760b66c31' })
  @IsString()
  hash: string;

  @ApiProperty({ description: 'BigCommerce Webhook created at', example: 1758273085 })
  @IsNumber()
  created_at: number;

  @ApiProperty({ description: 'BigCommerce Webhook store ID', example: '1003413319' })
  @IsString()
  store_id: string;

  @ApiProperty({ description: 'BigCommerce Webhook scope', example: 'store/order/created' })
  @IsString()
  scope: string;

  @ApiProperty({ description: 'BigCommerce Webhook data', example: { id: 101, type: 'order' } })
  @IsObject()
  data: any;

}
