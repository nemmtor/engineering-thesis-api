import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { rolesKey } from '../decorators/roles.decorator';
import { RequestWithUserJwtPayload } from '../types/request-with-user-jwt-payload';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      rolesKey,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context
      .switchToHttp()
      .getRequest<RequestWithUserJwtPayload>();

    return requiredRoles.some((role) => user.role === role);
  }
}
