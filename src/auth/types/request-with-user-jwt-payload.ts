import { Request } from 'express';
import { UserJwtPayload } from 'src/jwt/types/jwt-payload.type';

export type RequestWithUserJwtPayload = Request & { user: UserJwtPayload };
