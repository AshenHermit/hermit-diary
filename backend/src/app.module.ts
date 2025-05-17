import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmConfigService } from './database/typeorm/typeorm.service';
import { ApiModule } from './api/api.module';
import config from './config/config';
import { AppConfigModule } from './config/config.module';
import { AppConfigService } from './config/config.service';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        type: 'postgres',
        host: config.db.host,
        port: config.db.port,
        username: 'postgres',
        password: config.db.password,
        database: 'postgres',
        entities: config.db.entities,
        synchronize: config.db.sync,
      }),
    }),
    ApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
