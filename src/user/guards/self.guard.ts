import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RequestWithUser } from 'src/auth/auth.types';

@Injectable()
export class SelfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<RequestWithUser>();

    const { id } = req.params;

    // TODO: can it be handled in more generic way?
    if (['ADMIN', 'MANAGER'].includes(req.user.role)) {
      return true;
    }

    if (id === req.user.id) {
      return true;
    }

    return false;
  }
}
