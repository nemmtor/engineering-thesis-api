import { ApiProperty } from '@nestjs/swagger';
import { ItemType, SaleItem } from '.prisma/client';

export class Item implements SaleItem {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: true })
  isAvailable: boolean;

  // TODO: ItemType enum
  @ApiProperty({ example: 'RED_STAMP' })
  type: ItemType;
}
