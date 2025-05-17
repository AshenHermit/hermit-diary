import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleOauthGuard } from './google/auth-google.guard';
import { Response } from 'express';
import { GoogleAuthenticatedRequest } from './google/auth-google.strategy';
import { AppConfigService } from 'src/config/config.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { User } from 'src/database/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreateUserDTO } from './create-user.dto';
import { AuthTokenDTO } from './auth-token.dto';
import { AuthUserDTO } from './auth-user.dto';
import { UseAuthQuard } from './jwt-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly config: AppConfigService,
  ) {}

  @Post('register')
  @ApiOkResponse({ type: AuthTokenDTO })
  async register(@Body() createUserDto: CreateUserDTO) {
    await this.usersService.create(createUserDto);
    return await this.authService.login(
      createUserDto.email,
      createUserDto.password,
    );
  }

  @Post('login')
  @ApiOkResponse({ type: AuthTokenDTO })
  async login(@Body() body: AuthUserDTO, @Res() res: Response) {
    const token = await this.authService.login(body.email, body.password);
    this.authService.writeCookie(res, token);
    return token;
  }
  @Post('logout')
  @ApiOkResponse({ schema: { type: 'boolean' } })
  @UseAuthQuard()
  logout(@Res({ passthrough: true }) res: Response) {
    this.authService.clearCookie(res);
    return res.json(true);
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async google() {}

  @Get('callback/google')
  @UseGuards(GoogleOauthGuard)
  async googleCallback(
    @Req() req: GoogleAuthenticatedRequest,
    @Res() res: Response,
  ) {
    const user = req?.user;
    const token = await this.authService.forceLogin(
      user.email,
      user.name,
      user.picture,
      '',
    );
    this.authService.writeCookie(res, token);

    return res.redirect(this.config.site.host);
  }
}
