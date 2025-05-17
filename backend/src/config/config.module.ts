// src/config/config.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import configuration from './config';
import { AppConfigService } from './config.service';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true, // делает `ConfigService` глобальным
      load: [configuration],
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService], // экспортируем, чтобы использовать в других модулях
})
export class AppConfigModule {}
