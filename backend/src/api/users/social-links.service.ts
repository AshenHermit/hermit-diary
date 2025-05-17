import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from '../auth/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDTO } from './update-user.dto';
import { SocialLink } from 'src/database/entities/social-link.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSocialLinkDTO {
  @ApiProperty({
    example: 'vk',
    description: 'название для ссылки',
  })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'https://vk.com/user',
    description: 'ссылка на внешний сайт',
  })
  @IsOptional()
  @IsString()
  url: string;

  @ApiProperty({
    example: 'описание',
    description: 'описание',
  })
  @IsOptional()
  @IsString()
  description: string;
}

@Injectable()
export class SocialLinksService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(SocialLink)
    private socialLinksRepository: Repository<SocialLink>,
  ) {}

  async getByUser(user: User) {
    const socialLinks = await this.socialLinksRepository.find({
      where: { user: { id: user.id } },
      order: { id: 'ASC' },
    });
    return socialLinks;
  }

  async addNew(user: User) {
    const newLink: SocialLink = new SocialLink();
    newLink.user = user;
    const createdLink = this.socialLinksRepository.create(newLink);
    const savedLink = await this.socialLinksRepository.save(createdLink);
    return savedLink;
  }

  async update(id: number, updateData: UpdateSocialLinkDTO) {
    await this.socialLinksRepository.update(id, updateData);
  }

  async delete(id: number) {
    await this.socialLinksRepository.delete(id);
  }
}
