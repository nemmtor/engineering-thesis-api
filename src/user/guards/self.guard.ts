import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { RequestWithUser } from 'src/auth/auth.types';

@Injectable()
export class SelfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<RequestWithUser>();

    const { id } = req.params;

    // TODO: can it be handled in more generic way?
    if (req.user.role === UserRole.ADMIN) {
      return true;
    }

    if (id === req.user.id) {
      return true;
    }

    return false;
  }
}
