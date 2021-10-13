import { Request } from 'express';
import { UserWithoutPassword } from 'src/user/user.types';

export type RequestWithUser = Request & { user: UserWithoutPassword };
