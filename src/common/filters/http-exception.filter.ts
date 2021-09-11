import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { isPrismaError } from 'src/prisma/errors/is-prisma-error';
import { parsePrismaError } from 'src/prisma/errors/parse-prisma-error';
import { objectHasMessageField } from '../utils/object-has-message-field';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    if (typeof exceptionResponse === 'string') {
      response.status(status).json({
        errors: [exceptionResponse],
      });
      return;
    }

    if (isPrismaError(exceptionResponse)) {
      response.status(status).json({
        errors: parsePrismaError(exceptionResponse),
      });
      return;
    }

    if (objectHasMessageField(exceptionResponse)) {
      response.status(status).json({
        errors: Array.isArray(exceptionResponse.message)
          ? exceptionResponse.message
          : [exceptionResponse.message],
      });
      return;
    }

    response.status(status).json({
      errors: ['Something went wrong'],
    });
  }
}
