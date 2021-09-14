import { parseUniqueConstraintViolationError } from './parse-unique-constraint-error';
import { PrismaError, PrismaErrorCode } from './prisma-error.type';

type Parser = (error: PrismaError) => string[];

const mapErrorCodeToParser: Record<PrismaErrorCode, Parser> = {
  [PrismaErrorCode.UniqueConstraintViolation]:
    parseUniqueConstraintViolationError,
  [PrismaErrorCode.RecordNotFound]: parseUniqueConstraintViolationError,
};

export const parsePrismaError = (error: PrismaError) => {
  return mapErrorCodeToParser[error.code](error);
};
