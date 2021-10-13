import { UnauthorizedException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { mapUserRoleToLevel } from './map-user-role-to-level';

// TODO: move it to guard
export const checkRolePermission = (
  requestingUserRole: UserRole,
  targetUserRole: UserRole,
) => {
  const requestingUserLevel = mapUserRoleToLevel[requestingUserRole];
  const targetUserLevel = mapUserRoleToLevel[targetUserRole];

  if (requestingUserLevel <= targetUserLevel) {
    throw new UnauthorizedException();
  }
};
