import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IsBoolean,
  IsJSON,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Diary } from 'src/database/entities/diary.entity';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { PropertiesService } from '../properties/properties.service';

export class UpdateDiaryDTO {
  @ApiProperty({ example: 'Untitled', description: 'name', required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @ApiProperty({ example: 'true', description: 'is public', required: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiProperty({
    example: 'https://site.com/picture.webp',
    description: 'picture',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  picture?: string;

  @ApiProperty({
    example: '{}',
    description: 'rich text data structure',
    required: false,
  })
  @IsOptional()
  @IsJSON()
  description?: Record<string, any>;
}

@Injectable()
export class DiariesService {
  constructor(
    @InjectRepository(Diary) private diariesRepository: Repository<Diary>,
    private propertiesService: PropertiesService,
  ) {}

  async assertDiaryWriteAccess(user: User, diary: Diary) {
    if (user.id != diary.user.id) throw new UnauthorizedException('no access');
  }
  async assertDiaryReadAccess(user: User | undefined, diary: Diary) {
    if (diary.isPublic) return;
    if (user) {
      if (user.id == diary.user.id) return;
    }
    throw new UnauthorizedException('no access');
  }

  async getById(diaryId: number) {
    const diary = await this.diariesRepository.findOne({
      where: { id: diaryId },
      relations: ['user'],
    });
    return diary;
  }

  async getOfUser(userId: number, onlyPublic: boolean = true) {
    const diaries = await this.diariesRepository.find({
      where: { user: { id: userId }, isPublic: onlyPublic ? true : undefined },
    });

    const props = await this.propertiesService.getPropertiesForMultipleTargets(
      'diary',
      diaries.map((x) => x.id),
    );
    for (let i = 0; i < diaries.length; i++) {
      const diary = diaries[i];
      const properties = props[diary.id].properties;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (diary as any).properties = properties;
    }

    return diaries;
  }

  async createNew(forUser: User) {
    const newDiary = this.diariesRepository.create({ user: forUser });
    const savedDiary = await this.diariesRepository.save(newDiary);
    return savedDiary;
  }

  async updateDiary(id: number, updateDto: UpdateDiaryDTO) {
    await this.diariesRepository.update(id, updateDto);
  }

  async deleteDiary(id: number) {
    await this.diariesRepository.delete(id);
  }
}
