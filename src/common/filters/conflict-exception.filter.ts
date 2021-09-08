import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { getPrismaError } from '../errors/error.helpers';

@Catch(ConflictException)
export class ConflictExceptionFilter implements ExceptionFilter {
  catch(exception: ConflictException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const prismaError = getPrismaError(exception.getResponse());

    response.status(HttpStatus.CONFLICT).json({
      message: prismaError,
      statusCode: HttpStatus.CONFLICT,
    });
  }
}
