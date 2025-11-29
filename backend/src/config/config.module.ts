// src/config/config.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import configuration from './config';
import { AppConfigService } from './config.service';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true, // makes `ConfigService` global
      load: [configuration],
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService], // export to use in other modules
})
export class AppConfigModule {}
