import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Diary } from './diary.entity';
import { NoteArtefact } from './note-artefact.entity';

@Entity()
export class Note {
  @ApiProperty({ example: 1, description: 'Уникальный ID записи' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'date note created at' })
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @ApiProperty({ description: 'date note updated at' })
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;

  @ApiProperty({ example: 'Untitled', description: 'Заголовок записи' })
  @Column({ default: 'Untitled' })
  name: string;

  @ApiProperty({
    example: 'true',
    description: 'is public',
  })
  @Column({ default: true })
  isPublic: boolean;

  @ApiProperty({
    description: 'rich text content structure',
  })
  @Column({ nullable: true, default: null, type: 'jsonb', select: false })
  content: Record<string, any>;

  @ApiProperty({
    description: 'parent note id, like file in folder',
  })
  @Column({ nullable: true, default: null })
  parentNoteId: number;

  @ManyToOne(() => Diary, (diary) => diary.notes, { onDelete: 'CASCADE' })
  diary: Diary;

  @OneToMany(() => NoteArtefact, (artefact) => artefact.note, { cascade: true })
  artefacts: NoteArtefact[];

  @ManyToMany(() => Note, (note) => note.incomingLinks, { cascade: true })
  @JoinTable()
  outcomingLinks: Note[];

  @ManyToMany(() => Note, (note) => note.outcomingLinks)
  incomingLinks: Note[];
}
