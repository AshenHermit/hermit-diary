import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from '../auth/create-user.dto';
import { AuthService } from 'src/api/auth/auth.service';
import { JwtAuthGuard, UseAuthQuard } from 'src/api/auth/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/api/auth/jwt.strategy';
import { UpdateUserDTO } from './update-user.dto';
import { AuthUserDTO } from 'src/api/auth/auth-user.dto';
import { ApiBearerAuth, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { AuthTokenDTO } from 'src/api/auth/auth-token.dto';
import { User } from 'src/database/entities/user.entity';
import {
  SocialLinksService,
  UpdateSocialLinkDTO,
} from './social-links.service';
import { SocialLink } from 'src/database/entities/social-link.entity';
import { UserByIdPipe } from './user-by-id.pipe';

@Controller('api/users')
export class UsersSocialLinksController {
  constructor(
    private readonly usersService: UsersService,
    private readonly linksService: SocialLinksService,
  ) {}

  @ApiOkResponse({ type: SocialLink, isArray: true })
  @ApiParam({ name: 'id', type: Number })
  @Get(':id/sociallinks')
  async getSocialLinks(@Param('id', UserByIdPipe) user: User) {
    return (await this.linksService.getByUser(user)) ?? [];
  }

  @UseAuthQuard()
  @ApiOkResponse({ type: SocialLink })
  @ApiParam({ name: 'id', type: Number })
  @Post(':id/sociallinks')
  async addSocialLink(
    @Param('id', UserByIdPipe) user: User,
    @Req() req: AuthenticatedRequest,
  ) {
    if (req.user.id != user.id) throw new UnauthorizedException('no access');

    const newLink = this.linksService.addNew(user);
    return newLink;
  }

  @UseAuthQuard()
  @ApiOkResponse({ schema: { type: 'boolean' } })
  @ApiParam({ name: 'id', type: Number })
  @Patch(':id/sociallinks/:socialLinkId')
  async updateSocialLink(
    @Param('id', UserByIdPipe) user: User,
    @Param('socialLinkId') socialLinkId: number,
    @Body() data: UpdateSocialLinkDTO,
    @Req() req: AuthenticatedRequest,
  ) {
    if (req.user.id != user.id) throw new UnauthorizedException('no access');

    await this.linksService.update(socialLinkId, data);
    return true;
  }

  @UseAuthQuard()
  @ApiOkResponse({ schema: { type: 'boolean' } })
  @ApiParam({ name: 'id', type: Number })
  @Delete(':id/sociallinks/:socialLinkId')
  async deleteSocialLink(
    @Param('id', UserByIdPipe) user: User,
    @Param('socialLinkId') socialLinkId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    if (req.user.id != user.id) throw new UnauthorizedException('no access');

    await this.linksService.delete(socialLinkId);
    return true;
  }
}
