import { UnauthorizedException } from '@nestjs/common';
import { UserJwtPayload } from '../jwt.types';

export function assertIsValidJwt(
  payload: any,
): asserts payload is UserJwtPayload {
  if (typeof payload.id !== 'string') {
    throw new UnauthorizedException();
  }
}
