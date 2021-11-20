import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Request } from 'express';
import { assertIsValidJwt } from '../helpers/assert-is-valid-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: (req: Request) => {
        if (!req) return null;

        console.log('req.cookies:', req.cookies);
        console.log('req.cookies.accessToken:', req.cookies.accessToken);
        if (req.cookies && req.cookies.accessToken) {
          return req.cookies.accessToken;
        }

        // TODO: Remove this to migrate to cookies
        console.log('req.headers:', req.headers.authorization);

        console.log('req.body:', req.body);
        return req.headers.authorization;
      },
      ignoreExpiration: false,
      secretOrKey: process.env.SERVER_SECRET,
    });
  }

  validate(payload: unknown) {
    assertIsValidJwt(payload);

    return this.userService.findOne(payload.id);
  }
}
