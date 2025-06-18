import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { UseAuthQuard, UseSilentAuthQuard } from '../auth/jwt-auth.guard';
import { ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { AuthenticatedRequest, SilentAuthRequest } from '../auth/jwt.strategy';
import { Note } from 'src/database/entities/note.entity';
import { NoteArtefact } from 'src/database/entities/note-artefact.entity';
import {
  NoteArtefactsService,
  UpdateNoteArtefactDTO,
} from './notes.artefacts.service';

@Controller('api/notes')
export class NoteArtefactsController {
  constructor(
    private readonly notesService: NotesService,
    private readonly notesArtefactsService: NoteArtefactsService,
  ) {}

  @UseSilentAuthQuard()
  @ApiOkResponse({ type: NoteArtefact, isArray: true })
  @ApiParam({ name: 'noteId', type: Number })
  @Get(':noteId/artefacts')
  async getNoteArtefact(
    @Param('noteId', new ParseIntPipe()) noteId: number,
    @Req() req: SilentAuthRequest,
  ) {
    await this.notesService.assertNoteReadAccess(req.user, noteId);
    return await this.notesArtefactsService.getArtefacts(noteId);
  }

  @UseAuthQuard()
  @ApiOkResponse({ type: NoteArtefact })
  @ApiParam({ name: 'noteId', type: Number })
  @Post(':noteId/artefacts')
  async addNoteArtefact(
    @Param('noteId', new ParseIntPipe()) noteId: number,
    @Body() data: UpdateNoteArtefactDTO,
    @Req() req: AuthenticatedRequest,
  ) {
    await this.notesService.assertNoteWriteAccess(req.user, noteId);
    return await this.notesArtefactsService.addArtefact(noteId, data);
  }

  @UseAuthQuard()
  @ApiOkResponse({ type: NoteArtefact })
  @ApiParam({ name: 'noteId', type: Number })
  @ApiParam({ name: 'artefactId', type: Number })
  @Patch(':noteId/artefacts/:artefactId')
  async updateNoteArtefact(
    @Param('noteId', new ParseIntPipe()) noteId: number,
    @Param('artefactId', new ParseIntPipe()) artefactId: number,
    @Body() data: UpdateNoteArtefactDTO,
    @Req() req: AuthenticatedRequest,
  ) {
    await this.notesArtefactsService.assertWriteAccess(req.user, artefactId);
    if (data.noteId !== undefined) {
      await this.notesService.assertNoteWriteAccess(req.user, data.noteId);
    }
    return await this.notesArtefactsService.updateArtefact(artefactId, data);
  }
  @UseAuthQuard()
  @ApiOkResponse({ type: NoteArtefact })
  @ApiParam({ name: 'noteId', type: Number })
  @ApiParam({ name: 'artefactId', type: Number })
  @Delete(':noteId/artefacts/:artefactId')
  async deleteNoteArtefact(
    @Param('noteId', new ParseIntPipe()) noteId: number,
    @Param('artefactId', new ParseIntPipe()) artefactId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    await this.notesArtefactsService.assertWriteAccess(req.user, artefactId);
    return await this.notesArtefactsService.deleteArtefact(artefactId);
  }
}
