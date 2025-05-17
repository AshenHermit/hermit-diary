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
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { AuthTokenDTO } from 'src/api/auth/auth-token.dto';
import { User } from 'src/database/entities/user.entity';
import {
  SocialLinksService,
  UpdateSocialLinkDTO,
} from './social-links.service';
import { SocialLink } from 'src/database/entities/social-link.entity';

@Controller('api/users/profile')
export class UsersProfileController {
  constructor(private readonly usersService: UsersService) {}

  @UseAuthQuard()
  @ApiOkResponse({ type: User })
  @Get()
  async getProfile(@Req() req: AuthenticatedRequest) {
    return req.user;
  }

  @UseAuthQuard()
  @ApiOkResponse({ type: User })
  @Patch()
  async updateProfile(
    @Req() req: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDTO,
  ) {
    const user = req.user;
    await this.usersService.update(user.id, updateUserDto);
    return this.usersService.findOneByEmail(user.email);
  }

  @UseAuthQuard()
  @ApiOkResponse({ schema: { type: 'boolean' } })
  @Delete()
  async deleteProfile(@Req() req: AuthenticatedRequest) {
    const user = req.user;
    await this.usersService.remove(user.id);
    return true;
  }
}
