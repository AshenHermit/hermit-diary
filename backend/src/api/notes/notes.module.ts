import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from 'src/database/entities/note.entity';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { NoteContentService } from './note-content.service';
import { PropertiesModule } from '../properties/properties.module';
import { SearchModule } from '../search/search.module';

@Module({
  imports: [TypeOrmModule.forFeature([Note]), PropertiesModule, SearchModule],
  providers: [NotesService, NoteContentService],
  controllers: [NotesController],
  exports: [NotesService],
})
export class NotesModule {}
