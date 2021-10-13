import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserRole } from '.prisma/client';
import { RequestWithUserJwtPayload } from '../../auth/types/request-with-user-jwt-payload';

@Injectable()
export class SelfGuard implements CanActivate {
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
