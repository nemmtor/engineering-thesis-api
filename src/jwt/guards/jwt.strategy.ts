import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { assertIsValidJwt } from '../helpers/assert-is-valid-jwt';

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
    assertIsValidJwt(payload);

    return this.userService.findOne(payload.id);
  }
}
