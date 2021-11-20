import { PrismaError } from './prisma-error.type';

export const parseUniqueConstraintViolationError = (error: PrismaError) => {
  return (
    error.meta.target?.map((field: string) => `${field} has to be unique`) ||
    JSON.stringify(error)
  );
};
