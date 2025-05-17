import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from 'src/database/entities/note.entity';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { NoteContentService } from './note-content.service';
import { Property } from 'src/database/entities/property.entity';
import { PropertiesModule } from '../properties/properties.module';

@Module({
  imports: [TypeOrmModule.forFeature([Note]), PropertiesModule],
  providers: [NotesService, NoteContentService],
  controllers: [NotesController],
  exports: [NotesService],
})
export class NotesModule {}
