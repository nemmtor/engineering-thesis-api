import { ApiProperty } from '@nestjs/swagger';
import { Sale as PrismaSale } from '.prisma/client';
import { User } from './user';
import { Customer } from './customer';
import { Contract } from './contract';
import { Item } from './items';
import { Status } from './status';

export class Sale implements Partial<PrismaSale> {
  @ApiProperty({ example: '7f8162b2-12f4-484e-ae7f-dbbfe6a1a399' })
  id: string;

  @ApiProperty()
  user: User;

  @ApiProperty()
  qa: User;

  @ApiProperty()
  rep: User;

  @ApiProperty()
  customer: Customer;

  @ApiProperty()
  contract: Contract;

  @ApiProperty()
  item: Item;

  @ApiProperty()
  status: Status;

  @ApiProperty({
    example: 'Klient chce aby prawnik był specjalistą w zakresie prawa karnego',
  })
  others: string | null;
}
