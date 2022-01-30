import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SocketsGateway } from 'src/sockets/sockets.gateway';
import { UserWithRole } from 'src/user/user.types';
import { AddNotificationDto } from './dto/add-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    private socketGateway: SocketsGateway,
    private prismaService: PrismaService,
  ) {}

  async addSocketNotification(addNotificationDto: AddNotificationDto) {
    this.socketGateway.sendNotification(
      addNotificationDto.message,
      addNotificationDto.channel,
    );
  }

  async addDbNotification(
    notificationUserId: string,
    notificationTime: Date,
    message: string,
  ) {
    return this.prismaService.notification.create({
      data: {
        message,
        notificationTime: new Date(notificationTime.setHours(0, 0, 0, 0)),
        user: { connect: { id: notificationUserId } },
      },
    });
  }

  async getTodayNotifications(user: UserWithRole) {
    return this.prismaService.notification.findMany({
      where: {
        AND: [
          { userId: user.id },
          { read: false },
          {
            notificationTime: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        ],
      },
    });
  }

  async getAllNotifications(user: UserWithRole) {
    return this.prismaService.notification.findMany({
      where: { userId: user.id },
    });
  }

  async readNotification(user: UserWithRole, notificationId: string) {
    await this.prismaService.notification.updateMany({
      data: { read: true },
      where: { AND: [{ userId: user.id, id: notificationId }] },
    });
  }
}
