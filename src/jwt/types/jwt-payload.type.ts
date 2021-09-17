import { User } from '@prisma/client';

export type UserJwtPayload = Pick<User, 'email' | 'id' | 'role'>;
