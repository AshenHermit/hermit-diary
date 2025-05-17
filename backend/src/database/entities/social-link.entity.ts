import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class SocialLink {
  @ApiProperty({ example: 1, description: 'Уникальный ID ссылки' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'vk',
    description: 'название для ссылки',
  })
  @Column({ default: '' })
  title: string;

  @ApiProperty({
    example: 'https://vk.com/user',
    description: 'ссылка на внешний сайт',
  })
  @Column({ default: '' })
  url: string;

  @ApiProperty({
    example: 'описание',
    description: 'описание',
  })
  @Column({ default: '' })
  description: string;

  @ManyToOne(() => User, (user) => user.socialLinks, { onDelete: 'CASCADE' })
  user: User;
}
