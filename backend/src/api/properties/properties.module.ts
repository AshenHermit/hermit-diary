import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from 'src/database/entities/property.entity';
import { PropertiesService } from './properties.service';

@Module({
  imports: [TypeOrmModule.forFeature([Property])],
  controllers: [],
  providers: [PropertiesService],
  exports: [PropertiesService],
})
export class PropertiesModule {}
