import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RequestWithUser } from 'src/auth/auth.types';
import { Notification } from 'src/docs/swaggerTypes/notification';
import { JwtGuard } from 'src/jwt/guards/jwt.guard';
import { NotificationService } from './notification.service';

@ApiTags('Notification')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiOperation({ summary: 'Get not read notifications for today' })
  @ApiResponse({
    description: 'Success',
    status: 200,
    type: [Notification],
  })
  @UseGuards(JwtGuard)
  @Get()
  async getTodayNotifications(@Req() req: RequestWithUser) {
    return this.notificationService.getTodayNotifications(req.user);
  }

  @ApiOperation({ summary: 'Get all notifications' })
  @ApiResponse({
    description: 'Success',
    status: 200,
    type: [Notification],
  })
  @UseGuards(JwtGuard)
  @Get('/all')
  async getAllNotifications(@Req() req: RequestWithUser) {
    return this.notificationService.getAllNotifications(req.user);
  }

  @ApiOperation({ summary: 'Read notification' })
  @ApiResponse({
    description: 'Success',
    status: 201,
  })
  @UseGuards(JwtGuard)
  @Post(':notificationId')
  async readNotification(
    @Req() req: RequestWithUser,
    @Param('notificationId') notificationId: string,
  ) {
    return this.notificationService.readNotification(req.user, notificationId);
  }
}
