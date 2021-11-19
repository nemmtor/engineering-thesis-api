import { Users } from '@prisma/client';

export type UserJwtPayload = Pick<Users, 'id'>;
