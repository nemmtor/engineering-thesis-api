import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RequestWithUserJwtPayload } from '../types/request-with-user-jwt-payload';

@Injectable()
export class ActiveGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const { user } = context
      .switchToHttp()
      .getRequest<RequestWithUserJwtPayload>();

    return user.isActive;
  }
}
