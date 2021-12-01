import * as Sentry from '@sentry/node';
import { parseUniqueConstraintViolationError } from './parse-unique-constraint-error';
import { PrismaError, PrismaErrorCode } from './prisma-error.type';

type Parser = (error: PrismaError) => string[];

const mapErrorCodeToParser: Record<PrismaErrorCode, Parser> = {
  [PrismaErrorCode.UniqueConstraintViolation]:
    parseUniqueConstraintViolationError,
  [PrismaErrorCode.RecordNotFound]: parseUniqueConstraintViolationError,
};

export const parsePrismaError = (error: PrismaError) => {
  const parser = mapErrorCodeToParser[error.code];
  if (parser) {
    return parser(error);
  }

  Sentry.captureException(`Unhandled prisma error: ${error}`);
  return [`Unhandled prisma error: ${JSON.stringify(error)}`];
};
