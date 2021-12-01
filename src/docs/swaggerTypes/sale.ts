import { ApiProperty } from '@nestjs/swagger';
import { Sale as PrismaSale } from '.prisma/client';

export class Sale implements PrismaSale {
  @ApiProperty({ example: '7f8162b2-12f4-484e-ae7f-dbbfe6a1a399' })
  id: string;

  @ApiProperty({ example: '87efdb49-f294-44a9-a1b0-3c57afbd5e32' })
  userId: string;

  @ApiProperty({ example: '889ad0a9-86f1-4c3a-a75a-e4e1857e1093' })
  customerId: string;

  @ApiProperty({ example: '233cec0f-1990-49ff-bf57-8ded760aa78d' })
  contractId: string;

  @ApiProperty({ example: '02859475-4463-4e29-a292-7c09f11313ab' })
  itemId: number;

  @ApiProperty({ example: '4f18fbab-a57e-41c6-9036-93381751cdd0' })
  statusId: string;

  @ApiProperty({
    example: 'Klient chce aby prawnik był specjalistą w zakresie prawa karnego',
  })
  others: string | null;
}
