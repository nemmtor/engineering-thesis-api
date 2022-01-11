// .split("T")[0]
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Sale } from 'src/docs/swaggerTypes/sale-response';

const getFormattedSale = (data: Sale) => {
  if (!data?.contract?.plannedSignAt) return data;

  const [plannedSignedAtWithoutTime] = data.contract.plannedSignAt
    .toISOString()
    .split('T');
  return {
    ...data,
    contract: {
      ...data.contract,
      plannedSignAt: plannedSignedAtWithoutTime,
    },
  };
};

@Injectable()
export class FormatSaleResponseInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: Sale | Sale[]) => {
        if (Array.isArray(data)) {
          return data.map(getFormattedSale);
        }
        return getFormattedSale(data);
      }),
    );
  }
}
