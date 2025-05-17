import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_AUTH_CLIENT_ID ?? 'clientId',
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET ?? 'secret',
      callbackURL: process.env.GOOGLE_AUTH_CALLBACK,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;

    if (emails && name && photos) {
      const user = {
        provider: 'google',
        providerId: id,
        email: emails[0].value,
        name: `${name.givenName} ${name.familyName}`,
        picture: photos[0].value,
      };

      done(null, user);
      return;
    }
    done(null, false);
  }
}

export interface GoogleAuthenticatedRequest extends Request {
  user: {
    provider: 'google';
    providerId: number;
    email: string;
    name: string;
    picture: string;
  };
}
