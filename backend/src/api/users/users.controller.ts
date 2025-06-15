import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { User } from 'src/database/entities/user.entity';
import { SocialLinksService } from './social-links.service';

@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly linksService: SocialLinksService,
  ) {}

  @ApiOkResponse({ type: User })
  @Get(':userId')
  async getUser(@Param('userId', ParseIntPipe) id: number) {
    const user = await this.usersService.getById(id);
    return user;
  }
}
