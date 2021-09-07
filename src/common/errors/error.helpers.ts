import {
  isUniqeConstraintViolationError,
  parseUniqueConstraintViolationError,
} from './uniqueConstraintViolation/unique-constraint-violation';

export const getPrismaError = (error: any) => {
  if (isUniqeConstraintViolationError(error)) {
    return parseUniqueConstraintViolationError(error);
  }

  return 'Something went wrong';
};
