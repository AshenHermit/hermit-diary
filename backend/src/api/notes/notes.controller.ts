import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  Req,
} from '@nestjs/common';
import { UseAuthQuard, UseSilentAuthQuard } from '../auth/jwt-auth.guard';
import { ApiOkResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Note } from 'src/database/entities/note.entity';
import { AuthenticatedRequest, SilentAuthRequest } from '../auth/jwt.strategy';
import { NotesService, UpdateNoteDTO } from './notes.service';
import {
  NoteSearchService,
  SearchNotesDto,
} from '../search/note-search.service';

@Controller('api/notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @UseSilentAuthQuard()
  @ApiOkResponse({ type: Note, isArray: true })
  @ApiQuery({ name: 'diaryId', required: false })
  @Get()
  async selectNotes(
    @Req() req: SilentAuthRequest,
    @Query('diaryId', new ParseIntPipe({ optional: true })) diaryId?: number,
  ) {
    return await this.notesService.fetch({ diaryId: diaryId, user: req.user });
  }

  @UseSilentAuthQuard()
  @ApiOkResponse({ schema: { type: 'boolean' } })
  @Get('search')
  async searchNotes(
    @Req() req: SilentAuthRequest,
    @Query() query: SearchNotesDto,
  ) {
    return this.notesService.searchNotes(query.q, {
      tags: query.tags,
      isPublic: true,
      diaryIsPublic: true,
      page: query.page,
      perPage: query.perPage,
    });
  }

  @UseSilentAuthQuard()
  @ApiOkResponse({ type: Note })
  @ApiParam({ name: 'noteId', type: Number })
  @Get(':noteId')
  async getNote(
    @Param('noteId', new ParseIntPipe()) noteId: number,
    @Req() req: SilentAuthRequest,
  ) {
    return await this.notesService.getByIdForUser(noteId, req.user);
  }

  @UseSilentAuthQuard()
  @ApiParam({ name: 'noteId', type: Number })
  @ApiOkResponse({ schema: { type: 'boolean' } })
  @Get(':noteId/write_permission')
  async getWritePermission(
    @Param('noteId', new ParseIntPipe()) noteId: number,
    @Req() req: SilentAuthRequest,
  ) {
    if (!req.user) return false;
    try {
      await this.notesService.assertNoteWriteAccess(req.user, noteId);
    } catch (e) {
      console.error(e);
      return false;
    }
    return true;
  }

  @UseAuthQuard()
  @ApiOkResponse({ schema: { type: 'boolean' } })
  @ApiParam({ name: 'noteId', type: Number })
  @Patch(':noteId')
  async updateNote(
    @Param('noteId', new ParseIntPipe()) noteId: number,
    @Req() req: AuthenticatedRequest,
    @Body() data: UpdateNoteDTO,
  ) {
    await this.notesService.assertNoteWriteAccess(req.user, noteId);
    await this.notesService.updateNote(noteId, data, req.user);
    return true;
  }

  @UseAuthQuard()
  @ApiOkResponse({ schema: { type: 'boolean' } })
  @ApiParam({ name: 'noteId', type: Number })
  @Delete(':noteId')
  async deleteNote(
    @Param('noteId', new ParseIntPipe()) noteId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    await this.notesService.assertNoteWriteAccess(req.user, noteId);
    await this.notesService.deleteNote(noteId);
    return true;
  }
}
