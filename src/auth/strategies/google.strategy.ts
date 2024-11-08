import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID:
        '392622168466-ip5f8v8mh60q65hkonsubj20aln2jolr.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3000/auth/google/callback',
      scope: ['email'],
    });
  }

  async validate(
    accessToken: string,
    regreshToken: string,
    profile: Profile,
    done: any,
  ) {
    done(null, profile);
  }
}
