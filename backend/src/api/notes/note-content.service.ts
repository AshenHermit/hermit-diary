import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from 'src/database/entities/note.entity';
import { User } from 'src/database/entities/user.entity';
import { Brackets, Repository } from 'typeorm';
import { Diary } from 'src/database/entities/diary.entity';

type ContentBlock = Record<string, any>;

@Injectable()
export class NoteContentService {
  constructor(
    @InjectRepository(Note) private notesRepository: Repository<Note>,
  ) {}

  getNodesInBlocks(blocks: ContentBlock[]) {
    let collectedBlocks: ContentBlock[] = [];
    for (const block of blocks) {
      collectedBlocks.push(block);
      collectedBlocks = [
        ...collectedBlocks,
        ...this.getNodesInBlocks(block.children),
      ];
    }
    return collectedBlocks;
  }

  async getAllBlocks(content: Record<string, any>) {
    const blocks = this.getNodesInBlocks(content.blocks);
    return blocks;
  }

  async findOutcomingLinks(content: Record<string, any>) {
    const links: Note[] = [];
    const blocks = await this.getAllBlocks(content);
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      if (block.type == 'noteReference') {
        const props = block.props as Record<string, any>;
        if (props.note) {
          const noteProp = JSON.parse(props.note) as Record<string, any>;
          const linkNoteId = noteProp.id as number;
          const note = await this.notesRepository.findOne({
            where: { id: linkNoteId },
          });
          if (note) {
            links.push(note);
          }
        }
      }
    }
    return links;
  }

  async updateOutcomingLinks(content: Record<string, any>) {
    const links: Note[] = [];
    const blocks = await this.getAllBlocks(content);
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      if (block.type == 'noteReference') {
        const props = block.props as Record<string, any>;
        if (props.note) {
          const noteProp = JSON.parse(props.note) as Record<string, any>;
          const linkNoteId = noteProp.id as number;
          const note = await this.notesRepository.findOne({
            where: { id: linkNoteId },
          });
          if (note) {
            noteProp.name = note?.name;
          }
        }
      }
    }
    return content;
  }
}
