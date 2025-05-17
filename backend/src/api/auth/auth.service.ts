import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthTokenDTO } from './auth-token.dto';
import { Response } from 'express';
import { AppConfigService } from 'src/config/config.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private config: AppConfigService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (user?.password == '') return null;
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(email: string, password: string): Promise<AuthTokenDTO> {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    const payload = { email: user.email, sub: user.id, name: user.name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // DO NOT EXPOSE
  async forceLogin(
    email: string,
    name: string,
    picture: string,
    password: string,
  ): Promise<AuthTokenDTO> {
    let user = await this.usersService.findOneByEmail(email);
    if (!user) {
      user = await this.usersService.create({
        email: email,
        name: name,
        picture: picture,
        password: password,
      });
    }
    const payload = { email: user.email, sub: user.id, name: user.name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  writeCookie(res: Response, token: AuthTokenDTO) {
    res.cookie(this.config.site.authCookieName, token.access_token, {
      domain: this.config.site.commonDomain,
    });
  }
  clearCookie(res: Response) {
    res.clearCookie(this.config.site.authCookieName, {
      domain: this.config.site.commonDomain,
    });
  }
}
