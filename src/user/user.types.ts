import { UserRole, Users } from '@prisma/client';

export type UserSelect = Record<keyof Omit<Users, 'password'>, boolean>;

export type UserWithoutPassword = Omit<Users, 'password'>;

export type UserWithRole = UserWithoutPassword & { role: { role: UserRole } };

export type UsersQueryParams = {
  email?: string;
  name?: string;
  isActive?: boolean;
  isArchived?: boolean;
};
