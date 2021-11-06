import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { UserJwtPayload } from './jwt.types';

@Injectable()
export class JwtService {
  constructor(private nestJwtService: NestJwtService) {}

  encryptUser(jwtPayload: UserJwtPayload) {
    return this.nestJwtService.sign(jwtPayload);
  }
}
