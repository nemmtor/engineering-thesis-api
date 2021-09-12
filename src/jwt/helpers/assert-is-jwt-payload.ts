import { UnauthorizedException } from '@nestjs/common';
import { UserRole } from '.prisma/client';
import { UserJwtPayload } from '../types/jwt-payload.type';

export function assertIsJwtPayload(
  payload: any,
): asserts payload is UserJwtPayload {
  if (typeof payload.id !== 'string') {
    throw new UnauthorizedException();
  }

  if (typeof payload.email !== 'string') {
    throw new UnauthorizedException();
  }

  const roles = Object.values(UserRole);

  if (!roles.includes(payload.role)) {
    throw new UnauthorizedException();
  }
}
