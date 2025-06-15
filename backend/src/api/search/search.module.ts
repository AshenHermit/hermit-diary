import { Module } from '@nestjs/common';
import { TypesenseService } from './typesense.service';
import { AppConfigModule } from 'src/config/config.module';
import { NoteSearchService } from './note-search.service';

@Module({
  imports: [AppConfigModule],
  providers: [TypesenseService, NoteSearchService],
  exports: [TypesenseService, NoteSearchService],
})
export class SearchModule {}
