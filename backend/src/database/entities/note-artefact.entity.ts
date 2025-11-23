import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Diary } from './diary.entity';
import { Note } from './note.entity';

@Entity()
export class NoteArtefact {
  @ApiProperty({ example: 1, description: 'Unique artifact ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'date artefact created at' })
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @ApiProperty({ description: 'date artefact updated at' })
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;

  @ApiProperty({
    description: 'rich text content structure',
  })
  @Column({ nullable: true, default: null, type: 'jsonb' })
  content: Record<string, any>;

  @ApiProperty({
    description: 'embed code',
  })
  @Column({ nullable: true, default: null })
  embedCode: string;

  @ManyToOne(() => Note, (note) => note.artefacts, { onDelete: 'CASCADE' })
  note: Note;
}
