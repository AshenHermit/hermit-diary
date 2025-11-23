import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from 'typesense';
import { TypesenseService } from './typesense.service';

import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Diary } from 'src/database/entities/diary.entity';

export type NoteInSearch = {
  id: string;
  title: string;
  diaryId: string;
  isPublic: boolean;
  diaryIsPublic: boolean;
  content: string;
  tags: string[];
};
export type NoteInSearchWithDiary = NoteInSearch & {
  diary?: Diary;
};

export class SearchNotesDto {
  @ApiProperty({ description: 'Search query' })
  @IsString()
  q: string;

  @ApiPropertyOptional({
    description: 'List of tags (comma-separated)',
    type: [String],
  })
  @IsOptional()
  @Transform(({ value }: { value: string }) =>
    value.split(',').map((s: string) => s.trim()),
  )
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Page number', example: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: 'Results per page', example: 10 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(1)
  perPage?: number;
}

@Injectable()
export class NoteSearchService implements OnModuleInit {
  constructor(private readonly typesenseClient: TypesenseService) {}

  async onModuleInit() {
    const client = this.typesenseClient.getClient();
    try {
      await client.collections('notes').retrieve();
    } catch {
      await client.collections().create({
        name: 'notes',
        fields: [
          { name: 'id', type: 'string' },
          { name: 'title', type: 'string' },
          { name: 'content', type: 'string' },
          { name: 'diaryId', type: 'string', facet: true },
          { name: 'tags', type: 'string[]', facet: true },
          { name: 'isPublic', type: 'bool', facet: true },
          { name: 'diaryIsPublic', type: 'bool', facet: true },
        ],
      });
    }
  }

  async addNote(note: NoteInSearch) {
    return this.typesenseClient
      .getClient()
      .collections('notes')
      .documents()
      .create(note);
  }

  async upsertNote(note: Partial<NoteInSearch>) {
    return this.typesenseClient
      .getClient()
      .collections('notes')
      .documents()
      .upsert(note);
  }

  async deleteNote(noteId: string) {
    try {
      return this.typesenseClient
        .getClient()
        .collections('notes')
        .documents(noteId)
        .delete();
    } catch (e) {
      console.error(e);
    }
  }

  async searchNotes(
    query: string,
    options?: {
      tags?: string[];
      diaryId?: string;
      isPublic?: boolean;
      diaryIsPublic?: boolean;
      page?: number;
      perPage?: number;
    },
  ) {
    const filters: string[] = [];

    if (options?.tags?.length) {
      filters.push(`tags:=[${options.tags.join(',')}]`);
    }

    if (options?.diaryId) {
      filters.push(`diaryId:=${options.diaryId}`);
    }

    if (typeof options?.isPublic === 'boolean') {
      filters.push(`isPublic:=${options.isPublic}`);
    }

    if (typeof options?.diaryIsPublic === 'boolean') {
      filters.push(`diaryIsPublic:=${options.diaryIsPublic}`);
    }

    return this.typesenseClient
      .getClient()
      .collections('notes')
      .documents()
      .search({
        q: query,
        query_by: 'title,content',
        ...(filters.length ? { filter_by: filters.join(' && ') } : {}),
        page: options?.page ?? 1,
        per_page: options?.perPage ?? 10,
      });
  }
}
