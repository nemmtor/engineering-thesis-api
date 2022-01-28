import { Injectable } from '@nestjs/common';
import { SocketsGateway } from 'src/sockets/sockets.gateway';
import { AddNotificationDto } from './dto/add-notification.dto';

@Injectable()
export class NotificationService {
  constructor(private socketGateway: SocketsGateway) {}

  async addNotification(addNotificationDto: AddNotificationDto) {
    // await this.prismaService.notification.create({
    //   data: {
    //     message: addNotificationDto.message,
    //     userId: addNotificationDto.userId,
    //   },
    // });

    this.socketGateway.sendNotification(
      addNotificationDto.message,
      addNotificationDto.channel,
    );
  }
}
