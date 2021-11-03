import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { httpCodeToSentryStatus } from './http-code-to-sentry-status';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();

    const currentHub = Sentry.getCurrentHub();

    currentHub.configureScope((scope) => {
      scope.addEventProcessor((event) => {
        const eventCopy = { ...event };

        eventCopy.request = {
          method: request.method,
          ...event.request,
        };

        return eventCopy;
      });
    });

    const transaction = Sentry.startTransaction({
      op: 'http',
      name: request.url,
    });

    return next.handle().pipe(
      tap(() => {
        const response: Response = context.switchToHttp().getResponse();

        transaction.setHttpStatus(response.statusCode);

        transaction.setStatus(httpCodeToSentryStatus(response.statusCode));

        if (request.user) {
          transaction.setData('user', request.user);
        }

        transaction.finish();
      }),
    );
  }
}
