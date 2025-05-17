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
import { JwtAuthGuard } from 'src/api/auth/jwt-auth.guard';
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

@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly linksService: SocialLinksService,
  ) {}
}
