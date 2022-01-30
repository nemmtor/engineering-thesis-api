import { Module } from '@nestjs/common';
import { SocketsGateway } from 'src/sockets/sockets.gateway';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  providers: [NotificationService, SocketsGateway],
  controllers: [NotificationController],
})
export class NotificationModule {}
