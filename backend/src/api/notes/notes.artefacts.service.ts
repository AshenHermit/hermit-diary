import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from 'src/database/entities/note.entity';
import { User } from 'src/database/entities/user.entity';
import { Brackets, In, Repository } from 'typeorm';
import { Diary } from 'src/database/entities/diary.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsJSON,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { NoteContentService } from './note-content.service';
import {
  PropertiesDto,
  PropertiesService,
} from '../properties/properties.service';
import {
  NoteInSearch,
  NoteInSearchWithDiary,
  NoteSearchService,
} from '../search/note-search.service';
import { NoteArtefact } from 'src/database/entities/note-artefact.entity';
import { NotesService } from './notes.service';

export class UpdateNoteArtefactDTO {
  @ApiPropertyOptional({
    example: '{}',
    description: 'content tree data',
  })
  @IsOptional()
  @IsJSON()
  content?: Record<string, any>;

  @ApiPropertyOptional({ example: '<a href=""/>', description: 'embed code' })
  @IsOptional()
  @IsString()
  embedCode?: string;

  @ApiPropertyOptional({ example: 1, description: 'note id to update' })
  @IsOptional()
  @IsNumber()
  noteId?: number;
}

@Injectable()
export class NoteArtefactsService {
  constructor(
    @InjectRepository(Note) private notesRepository: Repository<Note>,
    @InjectRepository(NoteArtefact)
    private noteArtefactsRepository: Repository<NoteArtefact>,
    private readonly notesService: NotesService,
  ) {}

  async assertWriteAccess(user: User, artefactId: number) {
    const artefact = await this.getArtefactById(artefactId);
    if (artefact) {
      await this.notesService.assertNoteWriteAccess(user, artefact.note.id);
      return;
    }
    throw new UnauthorizedException('no access');
  }
  async assertReadAccess(user: User | undefined, artefactId: number) {
    const artefact = await this.getArtefactById(artefactId);
    if (artefact) {
      await this.notesService.assertNoteReadAccess(user, artefact.note.id);
      return;
    }
    throw new UnauthorizedException('no access');
  }

  async getArtefactById(artefactId: number) {
    const artefact = await this.noteArtefactsRepository.findOne({
      where: { id: artefactId },
      relations: { note: true },
    });
    if (!artefact) return null;

    return artefact;
  }

  async getArtefacts(noteId: number) {
    const artefacts = await this.noteArtefactsRepository.find({
      where: { note: { id: noteId } },
    });

    return artefacts;
  }

  async addArtefact(noteId: number, data: UpdateNoteArtefactDTO) {
    const note = await this.notesRepository.findOne({ where: { id: noteId } });
    if (!note) throw new BadRequestException('no such note');
    const { noteId: _, ...dataToUpdate } = data;

    const newNoteArtefact = this.noteArtefactsRepository.create({
      ...data,
      note,
    });
    const savedNoteArtefact =
      await this.noteArtefactsRepository.save(newNoteArtefact);
    return savedNoteArtefact;
  }
  async updateArtefact(artefactId: number, data: UpdateNoteArtefactDTO) {
    const artefact = await this.noteArtefactsRepository.findOne({
      where: { id: artefactId },
    });
    if (!artefact) throw new BadRequestException('no such artefact');

    let note: Note | null = null;
    if (data.noteId !== undefined)
      note = await this.notesRepository.findOne({ where: { id: data.noteId } });

    const { noteId: _, ...dataToUpdate } = data;
    await this.noteArtefactsRepository.update(artefactId, {
      ...dataToUpdate,
      ...(note ?? note),
    });

    return true;
  }
  async deleteArtefact(artefactId: number) {
    const artefact = await this.noteArtefactsRepository.findOne({
      where: { id: artefactId },
    });
    if (!artefact) throw new BadRequestException('no such artefact');

    await this.noteArtefactsRepository.delete(artefactId);
    return true;
  }
}
