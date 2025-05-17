import { Body, Controller, Get, Param, Patch, Req } from '@nestjs/common';
import { UseAuthQuard, UseSilentAuthQuard } from '../auth/jwt-auth.guard';
import { ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { Diary } from 'src/database/entities/diary.entity';
import { AuthenticatedRequest, SilentAuthRequest } from '../auth/jwt.strategy';
import { DiariesService } from './diaries.service';
import { DiaryByIdPipe } from './diary-by-id.pipe';
import { Note } from 'src/database/entities/note.entity';
import {
  PropertiesDto,
  PropertiesService,
} from '../properties/properties.service';

@Controller('api/diaries')
export class DiariesPropertiesController {
  constructor(
    private readonly diariesService: DiariesService,
    private readonly propertiesService: PropertiesService,
  ) {}

  @UseSilentAuthQuard()
  @ApiOkResponse({ type: PropertiesDto })
  @ApiParam({ name: 'diaryId', type: Number })
  @Get(':diaryId/properties')
  async getProperties(
    @Param('diaryId', DiaryByIdPipe) diary: Diary,
    @Req() req: SilentAuthRequest,
  ) {
    await this.diariesService.assertDiaryReadAccess(req.user, diary);
    return await this.propertiesService.getPropertiesForTarget(
      'diary',
      diary.id,
    );
  }

  @UseAuthQuard()
  @ApiOkResponse({ schema: { type: 'boolean' } })
  @ApiParam({ name: 'diaryId', type: Number })
  @Patch(':diaryId/properties')
  async updateProperties(
    @Param('diaryId', DiaryByIdPipe) diary: Diary,
    @Req() req: AuthenticatedRequest,
    @Body() body: PropertiesDto,
  ) {
    await this.diariesService.assertDiaryWriteAccess(req.user, diary);
    return await this.propertiesService.updatePropertiesForTarget(
      'diary',
      diary.id,
      body,
    );
  }
}
