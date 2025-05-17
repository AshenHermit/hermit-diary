import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Note } from './note.entity';

@Entity()
export class Diary {
  @ApiProperty({ example: 1, description: 'Уникальный ID дневника' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'date diary created at' })
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @ApiProperty({ description: 'date diary updated at' })
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;

  @ApiProperty({ example: 'Untitled', description: 'Имя дневника' })
  @Column({ default: 'Untitled' })
  name: string;

  @ApiProperty({
    example: 'https://site.com/picture.webp',
    description: 'picture',
  })
  @Column({ default: '' })
  picture: string;

  @ApiProperty({
    example: 'true',
    description: 'is public',
  })
  @Column({ default: true })
  isPublic: boolean;

  @ManyToOne(() => User, (user) => user.diaries, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Note, (note) => note.diary, { cascade: true })
  notes: Note[];

  @OneToMany(() => Note, (note) => note.diary, { cascade: true })
  properties: Note;
}
