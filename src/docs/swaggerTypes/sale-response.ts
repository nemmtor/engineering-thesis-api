import { ApiProperty } from '@nestjs/swagger';
import { Customer, Sale as PrismaSale } from '.prisma/client';
import { UserWithRole } from './user-with-role';

export class Sale implements Partial<PrismaSale> {
  @ApiProperty({ example: '7f8162b2-12f4-484e-ae7f-dbbfe6a1a399' })
  id: string;

  @ApiProperty()
  user: UserWithRole;

  @ApiProperty()
  qa: UserWithRole | null;

  @ApiProperty()
  rep: UserWithRole | null;

  @ApiProperty({ example: '889ad0a9-86f1-4c3a-a75a-e4e1857e1093' })
  customer: Customer;

  @ApiProperty({ example: 'TODO' })
  contract: string;

  @ApiProperty({ example: 'TODO' })
  item: number;

  @ApiProperty({ example: 'TODO' })
  status: string;

  @ApiProperty({
    example: 'Klient chce aby prawnik był specjalistą w zakresie prawa karnego',
  })
  others: string | null;
}
