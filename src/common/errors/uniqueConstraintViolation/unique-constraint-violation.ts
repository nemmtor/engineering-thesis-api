import { PrismaErrorCode } from '../error.enum';

export type UniqueConstraintViolationError = {
  code: PrismaErrorCode.UniqueConstraintViolation;
  meta: {
    target: string[];
  };
};

export const isUniqeConstraintViolationError = (
  error: any,
): error is UniqueConstraintViolationError => {
  return error.code === PrismaErrorCode.UniqueConstraintViolation;
};

export const parseUniqueConstraintViolationError = (
  error: UniqueConstraintViolationError,
) => {
  return error.meta.target.map((field) => `${field} has to be unique`);
};
