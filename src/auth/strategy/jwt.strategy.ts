import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { assertIsJwtPayload } from 'src/jwt/helpers/assert-is-jwt-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SERVER_SECRET,
    });
  }

  async validate(payload: any) {
    assertIsJwtPayload(payload);
    return payload;
  }
}
