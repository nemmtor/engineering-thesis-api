import { ApiProperty } from '@nestjs/swagger';
import { Notification as PrismaNotification } from '@prisma/client';

export class Notification implements PrismaNotification {
  @ApiProperty({ example: 'e923d135-b310-4686-a6b7-59c10bd8d220' })
  id: string;

  @ApiProperty({ example: new Date() })
  createdAt: Date;

  @ApiProperty({ example: 'Potwierdzić sprzedaż dla klienta Jan Kowalski' })
  message: string;

  @ApiProperty({ example: new Date() })
  notificationTime: Date;

  @ApiProperty({ example: false })
  read: boolean;

  @ApiProperty({ example: 'e923d135-b310-4686-a6b7-59c10bd8d220' })
  userId: string;
}
