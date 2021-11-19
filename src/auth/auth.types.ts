import { Request } from 'express';
import { UserWithRole } from 'src/user/user.types';

export type RequestWithUser = Request & { user: UserWithRole };

export type RequestWithUserId = Request & { user: { id: string } };
