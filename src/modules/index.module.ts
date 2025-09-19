import { Module } from '@nestjs/common';
import { AuthModule } from '@/modules/auth/auth.module';
import { UsersModule } from '@/modules/users/users.module';
import { WebhooksModule } from '@/modules/webhooks/webhooks.module';
import { BigCommerceModule } from '@/modules/bigcommerce/bigcommerce.module';
import { B2BBigCommerceModule } from '@/modules/b2b-bigcommerce/b2b-bigcommerce.module';
import { AcumaticaModule } from '@/modules/acumatica/acumatica.module';

@Module({
    imports: [
      AuthModule,
      UsersModule,
      WebhooksModule,
      BigCommerceModule,
      B2BBigCommerceModule,
      AcumaticaModule,
    ],
  })
  export class IModule {}