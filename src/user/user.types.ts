import { UserRole, User } from '@prisma/client';

export type UserSelect = Record<keyof Omit<User, 'password'>, boolean>;

export type UserWithoutPassword = Omit<User, 'password'>;

export type UserWithRole = UserWithoutPassword & { role: { name: UserRole } };

export type UsersQueryParams = {
  email?: string;
  name?: string;
  isActive?: boolean;
  isArchived?: boolean;
};
