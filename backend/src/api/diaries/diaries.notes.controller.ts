import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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
}
