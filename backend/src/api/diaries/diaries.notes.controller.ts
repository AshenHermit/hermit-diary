import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UseAuthQuard, UseSilentAuthQuard } from '../auth/jwt-auth.guard';
import { ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { Diary } from 'src/database/entities/diary.entity';
import { AuthenticatedRequest, SilentAuthRequest } from '../auth/jwt.strategy';
import { DiariesService, UpdateDiaryDTO } from './diaries.service';
import { User } from 'src/database/entities/user.entity';
import { UserByIdPipe } from '../users/user-by-id.pipe';
import { DiaryByIdPipe } from './diary-by-id.pipe';
import { Note } from 'src/database/entities/note.entity';
import { NotesService } from '../notes/notes.service';
import {
  NoteSearchService,
  SearchNotesDto,
} from '../search/note-search.service';

@Controller('api/diaries')
export class DiariesNotesController {
  constructor(
    private readonly diariesService: DiariesService,
    private readonly notesService: NotesService,
  ) {}

  @UseAuthQuard()
  @ApiOkResponse({ type: Note })
  @ApiParam({ name: 'diaryId', type: Number })
  @Post(':diaryId/notes')
  async addNote(
    @Param('diaryId', DiaryByIdPipe) diary: Diary,
    @Req() req: AuthenticatedRequest,
  ) {
    await this.diariesService.assertDiaryWriteAccess(req.user, diary);
    const newNote = await this.notesService.addNote(diary);
    return newNote;
  }

  @UseSilentAuthQuard()
  @ApiOkResponse({ schema: { type: 'boolean' } })
  @Get(':diaryId/notes/search')
  async searchNotes(
    @Req() req: SilentAuthRequest,
    @Param('diaryId', DiaryByIdPipe) diary: Diary,
    @Query() query: SearchNotesDto,
  ) {
    await this.diariesService.assertDiaryReadAccess(req.user, diary);
    const params = {
      tags: query.tags,
      diaryId: diary.id.toString(),
      page: query.page,
      perPage: query.perPage,
    };
    if (req.user && diary.user.id == req.user.id) {
      return this.notesService.searchNotes(query.q, params);
    } else {
      return this.notesService.searchNotes(query.q, {
        ...params,
        isPublic: true,
      });
    }
  }
}
