import { Module } from '@nestjs/common';
import { SocketsGateway } from 'src/sockets/sockets.gateway';
import { NotificationService } from './notification.service';

@Module({
  providers: [NotificationService, SocketsGateway],
})
export class NotificationModule {}
