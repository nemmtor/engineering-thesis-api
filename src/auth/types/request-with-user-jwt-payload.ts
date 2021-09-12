import { UserJwtPayload } from 'src/jwt/types/jwt-payload.type';

export type RequestWithUserJwtPayload = { user: UserJwtPayload };
