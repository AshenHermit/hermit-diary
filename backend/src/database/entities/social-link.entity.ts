import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class SocialLink {
  @ApiProperty({ example: 1, description: 'Unique link ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'vk',
    description: 'link title',
  })
  @Column({ default: '' })
  title: string;

  @ApiProperty({
    example: 'https://vk.com/user',
    description: 'link to external site',
  })
  @Column({ default: '' })
  url: string;

  @ApiProperty({
    example: 'description',
    description: 'description',
  })
  @Column({ default: '' })
  description: string;

  @ManyToOne(() => User, (user) => user.socialLinks, { onDelete: 'CASCADE' })
  user: User;
}
