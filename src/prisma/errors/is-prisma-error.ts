import { PrismaError } from './prisma-error.type';

export const isPrismaError = (error: any): error is PrismaError => {
  if (error.code && error.clientVersion) return true;
  return false;
};
