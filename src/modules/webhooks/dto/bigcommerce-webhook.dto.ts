import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsObject, IsOptional } from 'class-validator';

export class BigCommerceWebhookDto {
  @ApiProperty({ description: 'BigCommerce Webhook store ID', example: '11111' })
  @IsString()
  store_id: string;

  @ApiProperty({ description: 'BigCommerce Webhook producer', example: 'stores/abcde' })
  @IsString()
  producer: string;

  @ApiProperty({ description: 'BigCommerce Webhook scope', example: 'store/customer/created' })
  @IsString()
  scope: string;

  @ApiProperty({ description: 'BigCommerce Webhook data', example: { id: 123, type: 'order' } })
  @IsObject()
  data: any;

  @ApiProperty({ description: 'BigCommerce Webhook hash', example: '3f9ea420af83450d7ef9f78b08c8af25b2213637' })
  @IsString()
  hash: string;
}
