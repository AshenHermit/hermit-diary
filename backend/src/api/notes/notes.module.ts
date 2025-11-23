import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from 'src/database/entities/note.entity';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { NoteContentService } from './note-content.service';
import { PropertiesModule } from '../properties/properties.module';
import { SearchModule } from '../search/search.module';
import { NoteArtefact } from 'src/database/entities/note-artefact.entity';
import { NoteArtefactsService } from './notes.artefacts.service';
import { NoteArtefactsController } from './notes.artefacts.controller';
import { Diary } from 'src/database/entities/diary.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Note, Diary]),
    TypeOrmModule.forFeature([NoteArtefact]),
    PropertiesModule,
    SearchModule,
  ],
  providers: [NotesService, NoteContentService, NoteArtefactsService],
  controllers: [NotesController, NoteArtefactsController],
  exports: [NotesService, NoteArtefactsService],
})
export class NotesModule {}
