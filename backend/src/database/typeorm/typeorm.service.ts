import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/config/config.interface';
import { AppConfigService } from 'src/config/config.service';

export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private config: AppConfigService) {}
  public createTypeOrmOptions(
    connectionName?: string,
  ): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    const db = this.config.db;

    return {
      type: 'postgres',
      host: db.host,
      port: db.port,
      username: 'postgres',
      password: db.password,
      database: 'postgres',
      entities: db.entities,
      synchronize: db.sync,
    };
  }
}
