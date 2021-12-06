import { ApiProperty } from '@nestjs/swagger';
import { Contract as PrismaContract } from '.prisma/client';

export class Contract implements PrismaContract {
  @ApiProperty({ example: new Date() })
  createdAt: Date;

  @ApiProperty({ example: new Date() })
  signedAt: Date;

  @ApiProperty({ example: new Date() })
  updatedAt: Date;

  @ApiProperty({ example: new Date() })
  plannedSignAt: Date;

  @ApiProperty({ example: '8e703d0e-5df6-456a-8f58-f45e63b03812' })
  id: string;

  @ApiProperty({ example: 24 })
  length: number;

  @ApiProperty({ example: 199 })
  price: number;

  @ApiProperty({ example: 'ul. Polna 8f/26, 87-100 Toruń' })
  signAddress: string;
}
