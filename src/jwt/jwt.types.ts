import { User } from '@prisma/client';

export type UserJwtPayload = Pick<User, 'id'>;
