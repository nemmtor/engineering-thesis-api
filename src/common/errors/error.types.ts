import {
  isUniqeConstraintViolationError,
  parseUniqueConstraintViolationError,
} from './uniqueConstraintViolation/unique-constraint-violation';

export enum PrismaErrorCode {
  UniqueConstraintViolation = 'P2002',
}

export const getPrismaError = (error: any) => {
  if (isUniqeConstraintViolationError(error)) {
    return parseUniqueConstraintViolationError(error);
  }

  return 'Something went wrong';
};
