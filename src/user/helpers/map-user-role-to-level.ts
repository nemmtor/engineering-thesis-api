import { UserRole } from '.prisma/client';

export const mapUserRoleToLevel = {
  [UserRole.ADMIN]: 5,
  [UserRole.MANAGER]: 4,
  [UserRole.QUALITY_CONTROLLER]: 3,
  [UserRole.SALES_REPRESENTATIVE]: 2,
  [UserRole.USER]: 1,
};
