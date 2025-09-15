import { Global, Module } from '@nestjs/common';
import { IModule } from '@/modules/index.module';
import { CoreModule } from '@/core/core.module';

@Global()
@Module({
  imports: [
    CoreModule,
    IModule
  ],
})
export class AppModule {}
