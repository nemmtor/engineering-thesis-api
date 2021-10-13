import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '.prisma/client';
import { RequestWithUserJwtPayload } from '../../auth/types/request-with-user-jwt-payload';

@Injectable()
export class SelfGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<RequestWithUserJwtPayload>();

    const { id } = req.params;

    if (req.user.role === UserRole.ADMIN) {
      return true;
    }

    if (id === req.user.id) {
      return true;
    }

    return false;
  }
}
