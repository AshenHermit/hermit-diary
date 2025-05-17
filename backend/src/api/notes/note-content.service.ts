import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from 'src/database/entities/note.entity';
import { User } from 'src/database/entities/user.entity';
import { Brackets, Repository } from 'typeorm';
import { Diary } from 'src/database/entities/diary.entity';

@Injectable()
export class NoteContentService {
  constructor(
    @InjectRepository(Note) private notesRepository: Repository<Note>,
  ) {}

  async getAllNodes(content: Record<string, any>) {
    const nodes: Record<string, any>[] = [];
    Object.keys(content).forEach((key) => {
      const block: Record<string, any> = content[key] as Record<string, any>;
      const values: Record<string, any>[] = block.value as Record<
        string,
        any
      >[];

      values.forEach((value) => {
        nodes.push(value);
      });
    });
    return nodes;
  }

  async findOutcomingLinks(content: Record<string, any>) {
    const links: Note[] = [];
    const nodes = await this.getAllNodes(content);
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.type == 'note-reference') {
        const props = node.props as Record<string, any>;
        if (props.note) {
          const linkNoteId = (props.note as Record<string, any>).id as number;
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
    const nodes = await this.getAllNodes(content);
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.type == 'note-reference') {
        const props = node.props as Record<string, any>;
        if (props.note) {
          const noteProp = props.note as Record<string, any>;
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
