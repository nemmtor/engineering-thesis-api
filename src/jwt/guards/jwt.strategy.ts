import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { assertIsJwtPayload } from 'src/jwt/helpers/assert-is-jwt-payload';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SERVER_SECRET,
    });
  }

  validate(payload: unknown) {
    assertIsJwtPayload(payload);

    return this.userService.findOne(payload.id);
  }
}
