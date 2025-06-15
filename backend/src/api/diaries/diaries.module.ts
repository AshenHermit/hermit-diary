import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diary } from 'src/database/entities/diary.entity';
import { DiariesService } from './diaries.service';
import { DiariesController } from './diaries.controller';
import { NotesModule } from '../notes/notes.module';
import { DiariesNotesController } from './diaries.notes.controller';
import { PropertiesModule } from '../properties/properties.module';
import { DiariesPropertiesController } from './diaries.properties.controller';
import { SearchModule } from '../search/search.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Diary]),
    NotesModule,
    PropertiesModule,
    SearchModule,
  ],
  providers: [DiariesService],
  controllers: [
    DiariesController,
    DiariesNotesController,
    DiariesPropertiesController,
  ],
  exports: [DiariesService],
})
export class DiariesModule {}
