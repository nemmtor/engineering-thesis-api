export enum PrismaErrorCode {
  UniqueConstraintViolation = 'P2002',
  RecordNotFound = 'P2025',
}

export type PrismaError = {
  code: PrismaErrorCode;
  clientVersion: string;
  // TODO: type safe
  meta: any;
};
