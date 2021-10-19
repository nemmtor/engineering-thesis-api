import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { assertIsValidJwt } from './helpers/assert-is-valid-jwt';
import { UserJwtPayload } from './jwt.types';

@Injectable()
export class JwtService {
  constructor(private nestJwtService: NestJwtService) {}

  encryptUser(jwtPayload: UserJwtPayload) {
    return this.nestJwtService.sign(jwtPayload);
  }

  decryptUser(token: string): UserJwtPayload {
    const encryptedToken = this.nestJwtService.decode(token);

    assertIsValidJwt(encryptedToken);

    return encryptedToken;
  }
}
