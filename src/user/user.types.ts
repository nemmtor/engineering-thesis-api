import { User } from '@prisma/client';

export type UserSelect = Record<keyof Omit<User, 'password'>, boolean>;
export type UserWithoutPassword = Omit<User, 'password'>;

export type UsersQueryParams = {
  email?: string;
  name?: string;
  isActive?: boolean;
};
