import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from 'src/database/entities/note.entity';
import { User } from 'src/database/entities/user.entity';
import { Brackets, In, Repository } from 'typeorm';
import { Diary } from 'src/database/entities/diary.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsJSON,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { NoteContentService } from './note-content.service';
import {
  PropertiesDto,
  PropertiesService,
} from '../properties/properties.service';

export class UpdateNoteDTO {
  @ApiProperty({ example: 'Untitled', description: 'name', required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @ApiProperty({
    example: '{}',
    description: 'content tree data',
    required: false,
  })
  @IsOptional()
  @IsJSON()
  content?: Record<string, any>;

  @ApiProperty({ example: 'true', description: 'is public', required: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  properties?: PropertiesDto['properties'];
}

export class NoteWithPropsDTO {
  name?: string;
  content?: Record<string, any>;
  isPublic?: boolean;
}

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note) private notesRepository: Repository<Note>,
    private readonly noteContentService: NoteContentService,
    private readonly propertiesService: PropertiesService,
  ) {}

  async assertNoteWriteAccess(user: User, noteId: number) {
    const note = await this.getByIdForUser(noteId, user);

    if (!note || user.id != note.diary.user.id)
      throw new UnauthorizedException('no access');
  }
  async assertNoteReadAccess(user: User | undefined, note: Note) {
    if (note.isPublic) return;
    if (user) {
      if (user.id == note.diary.user.id) return;
    }
    throw new UnauthorizedException('no access');
  }

  async selectQuery({
    noteId,
    user,
    diaryId,
    selectUser,
    verbose,
  }: {
    noteId?: number;
    user?: User;
    diaryId?: number;
    selectUser?: boolean;
    verbose?: boolean;
  }) {
    let query = this.notesRepository.createQueryBuilder('note');
    if (diaryId !== undefined) {
      query = query.innerJoin('note.diary', 'diary');
    } else {
      query = query.innerJoinAndSelect('note.diary', 'diary');
    }
    query = query.leftJoinAndSelect('note.outcomingLinks', 'outcomingLink');
    query = query.leftJoinAndSelect('note.incomingLinks', 'incomingLink');
    if (selectUser) {
      query = query.innerJoinAndSelect('diary.user', 'user');
    } else {
      query = query.innerJoin('diary.user', 'user');
    }
    if (user !== undefined) {
      query = query.where(
        new Brackets((qb) => {
          qb.where('note.isPublic = true AND diary.isPublic = true').orWhere(
            'user.id = :userId',
            { userId: user.id },
          );
        }),
      );
    } else {
      query = query.where(
        new Brackets((qb) => {
          qb.where('note.isPublic = true').andWhere('diary.isPublic = true');
        }),
      );
    }
    if (noteId !== undefined) {
      query = query.andWhere('note.id = :noteId', { noteId });
    }
    if (diaryId !== undefined) {
      query = query.andWhere('diary.id = :diaryId', { diaryId });
    }
    if (verbose) query = query.addSelect('note.content');
    return query;
  }

  async getByIdForUser(noteId: number, user: User | undefined) {
    const note = await (
      await this.selectQuery({ noteId, user, selectUser: true, verbose: true })
    ).getOne();
    if (note) {
      const properties = await this.propertiesService.getPropertiesForTarget(
        'note',
        noteId,
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (note as any).properties = properties.properties;
    }
    return note;
  }

  async fetch(params: Parameters<typeof this.selectQuery>[0]): Promise<Note[]> {
    const notes = await (await this.selectQuery(params)).getMany();
    const props = await this.propertiesService.getPropertiesForMultipleTargets(
      'note',
      notes.map((x) => x.id),
    );

    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      const properties = props[note.id].properties;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (note as any).properties = properties;
    }
    return notes;
  }

  async addNote(diary: Diary) {
    const newNote = this.notesRepository.create({ diary });
    const savedNote = await this.notesRepository.save(newNote);
    return savedNote;
  }

  async updateNote(id: number, updateDto: UpdateNoteDTO, user: User) {
    const { properties, ...updateData } = updateDto;

    await this.notesRepository.update(id, updateData);

    if (updateDto.properties) {
      await this.propertiesService.updatePropertiesForTarget('note', id, {
        properties: updateDto.properties,
      });
    }
    if (updateDto.content) {
      await this.updateLinks(id, updateDto.content, user);
    }
    if (updateDto.name) {
      await this.updateNames(id, user);
    }
  }
  async updateLinks(id: number, content: UpdateNoteDTO['content'], user: User) {
    if (!content) return;
    const note = await this.notesRepository.findOne({
      where: { id: id },
      relations: { outcomingLinks: true },
    });
    if (!note) throw new NotFoundException('Заметка не найдена');

    const links = await this.noteContentService.findOutcomingLinks(content);

    for (let i = 0; i < links.length; i++) {
      const linkedNote = links[i];
      await this.assertNoteWriteAccess(user, linkedNote.id);
    }

    note.outcomingLinks = links;

    return this.notesRepository.save(note);
  }
  async updateNames(id: number, user: User) {
    const note = await this.notesRepository.findOne({
      where: { id: id },
      relations: { incomingLinks: true },
    });
    if (note) {
      const incomingNotes = note.incomingLinks;
      for (let i = 0; i < incomingNotes.length; i++) {
        const inNoteObj = incomingNotes[i];
        const incomingNote = await this.getByIdForUser(inNoteObj.id, user);

        if (incomingNote) {
          await this.noteContentService.updateOutcomingLinks(
            incomingNote.content,
          );
          await this.notesRepository.save(incomingNote);
        }
      }
    }
  }

  async deleteNote(id: number) {
    await this.notesRepository.delete(id);
  }
}
