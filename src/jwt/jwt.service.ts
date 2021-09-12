import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { UserJwtPayload } from './types/jwt-payload.type';
import { assertIsJwtPayload } from './helpers/assert-is-jwt-payload';

@Injectable()
export class JwtService {
  constructor(private nestJwtService: NestJwtService) {}

  encryptUser(jwtPayload: UserJwtPayload) {
    return this.nestJwtService.sign(jwtPayload);
  }

  decryptUser(token: string): UserJwtPayload {
    const encryptedToken = this.nestJwtService.decode(token);

    assertIsJwtPayload(encryptedToken);

    return encryptedToken;
  }
}
