import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { User } from 'src/database/entities/user.entity';
import { AppConfigService } from 'src/config/config.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private usersService: UsersService,
    private readonly config: AppConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.site.authSecret,
    });
  }

  async validate(payload: { email: string }) {
    const user = await this.usersService.findOneByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

@Injectable()
export class JwtSilentStrategy extends PassportStrategy(
  Strategy,
  'jwt-silent',
) {
  constructor(
    private usersService: UsersService,
    private readonly config: AppConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.site.authSecret,
    });
  }

  async validate(payload: { email: string }) {
    const user = await this.usersService.findOneByEmail(payload.email);
    if (!user) {
      return null;
    }
    return user;
  }
}

export interface AuthenticatedRequest extends Request {
  user: User;
}
export interface SilentAuthRequest extends Request {
  user: User | undefined;
}
