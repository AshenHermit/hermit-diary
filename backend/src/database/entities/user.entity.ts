import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SocialLink } from './social-link.entity';
import { Diary } from './diary.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @ApiProperty({ example: 1, description: 'Уникальный ID пользователя' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: 'hashpass', description: 'Хэшированный пароль' })
  @Column({ select: false })
  @Exclude({ toClassOnly: true })
  password: string;

  @ApiProperty({ example: 'Anna Lord', description: 'Имя пользователя' })
  @Column()
  name: string;

  @ApiProperty({ type: String, example: '1990-05-15' })
  @Column({ type: 'date', nullable: true, default: null })
  birthday: Date;

  @ApiProperty({
    example: 'https://site.com/picture.webp',
    description: 'picture',
  })
  @Column({ default: '' })
  picture: string;

  @ApiProperty({
    example: 'google',
    description: 'Сервис авторизации',
  })
  @Column({ default: 'email' })
  service: 'email' | 'google' | 'vk' | 'yandex' | 'github';

  @OneToMany(() => SocialLink, (socialLink) => socialLink.user, {
    cascade: true,
  })
  socialLinks: [SocialLink];

  @OneToMany(() => Diary, (diary) => diary.user, {
    cascade: true,
  })
  diaries: [Diary];
}
