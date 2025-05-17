import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config.interface';
import config from './config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService<AppConfig>) {}

  get site() {
    return this.configService.get<AppConfig['site']>('site') ?? config().site;
  }
  get db() {
    return this.configService.get<AppConfig['db']>('db') ?? config().db;
  }
  get storage() {
    return (
      this.configService.get<AppConfig['storage']>('storage') ??
      config().storage
    );
  }
  get isProduction() {
    return (
      this.configService.get<AppConfig['nodeEnv']>('nodeEnv') == 'production'
    );
  }
}
