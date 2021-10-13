import { UnauthorizedException } from '@nestjs/common';
import { UserJwtPayload } from '../types/jwt-payload.type';

export function assertIsJwtPayload(
  payload: any,
): asserts payload is UserJwtPayload {
  if (typeof payload.id !== 'string') {
    throw new UnauthorizedException();
  }
}
