import { Module } from '@nestjs/common';
import { AuthModule } from '@/modules/auth/auth.module';
import { UsersModule } from '@/modules/users/users.module';
import { WebhooksModule } from '@/modules/webhooks/webhooks.module';

@Module({
    imports: [
      AuthModule,
      UsersModule,
      WebhooksModule,
    ],
  })
  export class IModule {}