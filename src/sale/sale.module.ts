import { Module } from '@nestjs/common';
import { NotificationService } from 'src/notification/notification.service';
import { SocketsGateway } from 'src/sockets/sockets.gateway';
import { SaleController } from './sale.controller';
import { SaleService } from './sale.service';

@Module({
  controllers: [SaleController],
  providers: [SaleService, NotificationService, SocketsGateway],
  exports: [SaleService],
})
export class SaleModule {}
