import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'supertest';

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

    transaction.setStatus('ok');

    return next.handle().pipe(
      tap(() => {
        // TODO: Map error code to sentry message
        // const response: Response = context.switchToHttp().getResponse();
        // transaction.setStatus('unauthenticated');
        transaction.finish();
      }),
    );
  }
}
