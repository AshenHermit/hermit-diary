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
import { UsersService } from './users.service';
import { UseAuthQuard, UseSilentAuthQuard } from 'src/api/auth/jwt-auth.guard';
import {
  AuthenticatedRequest,
  SilentAuthRequest,
} from 'src/api/auth/jwt.strategy';
import { ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { User } from 'src/database/entities/user.entity';
import { DiariesService, UpdateDiaryDTO } from '../diaries/diaries.service';
import { Diary } from 'src/database/entities/diary.entity';
import { UserByIdPipe } from './user-by-id.pipe';

@Controller('api/users')
export class UsersDiariesController {
  constructor(
    private readonly usersService: UsersService,
    private readonly diariesService: DiariesService,
  ) {}

  @UseSilentAuthQuard()
  @Get(':id/diaries')
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: Diary, isArray: true })
  async getDiaries(
    @Param('id', UserByIdPipe) user: User,
    @Req() req: SilentAuthRequest,
  ) {
    let onlyPublic = true;
    if (req.user) {
      if (req.user.id == user.id) onlyPublic = false;
    }
    const diaries = this.diariesService.getOfUser(user.id, onlyPublic);
    return diaries;
  }

  @UseAuthQuard()
  @ApiOkResponse({ type: Diary })
  @ApiParam({ name: 'id', type: Number })
  @Post(':id/diaries')
  async addDiary(
    @Param('id', UserByIdPipe) user: User,
    @Req() req: AuthenticatedRequest,
  ) {
    if (req.user.id != user.id) throw new UnauthorizedException('no access');
    const newDiary = await this.diariesService.createNew(user);
    return newDiary;
  }
}
