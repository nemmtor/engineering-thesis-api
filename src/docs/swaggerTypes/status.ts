import { ApiProperty } from '@nestjs/swagger';
import { SaleStatus, StatusType } from '.prisma/client';

export class Status implements SaleStatus {
  @ApiProperty({ example: 'e923d135-b310-4686-a6b7-59c10bd8d220' })
  id: string;

  @ApiProperty({ example: '' })
  message: string;

  @ApiProperty({ example: 'BEFORE_QA' })
  type: StatusType;

  @ApiProperty({ example: new Date() })
  updatedAt: Date;
}
