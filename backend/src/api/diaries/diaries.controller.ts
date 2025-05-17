import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UseAuthQuard, UseSilentAuthQuard } from '../auth/jwt-auth.guard';
import { ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { Diary } from 'src/database/entities/diary.entity';
import { AuthenticatedRequest, SilentAuthRequest } from '../auth/jwt.strategy';
import { DiariesService, UpdateDiaryDTO } from './diaries.service';
import { User } from 'src/database/entities/user.entity';
import { UserByIdPipe } from '../users/user-by-id.pipe';
import { DiaryByIdPipe } from './diary-by-id.pipe';
import { Note } from 'src/database/entities/note.entity';
import { PropertiesService } from '../properties/properties.service';

@Controller('api/diaries')
export class DiariesController {
  constructor(
    private readonly diariesService: DiariesService,
    private readonly propertiesService: PropertiesService,
  ) {}

  @UseSilentAuthQuard()
  @ApiParam({ name: 'diaryId', type: Number })
  @ApiOkResponse({ type: Diary })
  @Get(':diaryId')
  async getDiary(
    @Param('diaryId', DiaryByIdPipe) diary: Diary,
    @Req() req: SilentAuthRequest,
  ) {
    await this.diariesService.assertDiaryReadAccess(req.user, diary);
    return diary;
  }

  @UseSilentAuthQuard()
  @ApiParam({ name: 'diaryId', type: Number })
  @ApiOkResponse({ schema: { type: 'boolean' } })
  @Get(':diaryId/write_permission')
  async getWritePermission(
    @Param('diaryId', DiaryByIdPipe) diary: Diary,
    @Req() req: SilentAuthRequest,
  ) {
    if (!req.user) return false;
    try {
      await this.diariesService.assertDiaryWriteAccess(req.user, diary);
    } catch (e) {
      console.error(e);
      return false;
    }
    return true;
  }

  @UseAuthQuard()
  @ApiOkResponse({ schema: { type: 'boolean' } })
  @ApiParam({ name: 'diaryId', type: Number })
  @Patch(':diaryId')
  async updateDiary(
    @Param('diaryId', DiaryByIdPipe) diary: Diary,
    @Req() req: AuthenticatedRequest,
    @Body() body: UpdateDiaryDTO,
  ) {
    await this.diariesService.assertDiaryWriteAccess(req.user, diary);
    await this.diariesService.updateDiary(diary.id, body);
    return true;
  }
  @UseAuthQuard()
  @ApiOkResponse({ schema: { type: 'boolean' } })
  @ApiParam({ name: 'diaryId', type: Number })
  @Delete(':diaryId')
  async deleteDiary(
    @Param('diaryId', DiaryByIdPipe) diary: Diary,
    @Req() req: AuthenticatedRequest,
  ) {
    await this.diariesService.assertDiaryWriteAccess(req.user, diary);
    await this.propertiesService.removePropertiesOfTarget('diary', diary.id);
    await this.diariesService.deleteDiary(diary.id);
    return true;
  }
}
