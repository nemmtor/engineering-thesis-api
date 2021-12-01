import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';
import { CreateContractDto } from './create-contract.dto';
import { CreateCustomerDto } from './create-customer.dto';

export class CreateSaleDto {
  @ApiProperty()
  contract: CreateContractDto;

  @ApiProperty()
  customer: CreateCustomerDto;

  @ApiProperty({ example: 1 })
  @IsInt()
  itemId: number;

  @ApiProperty({
    example:
      'Klient prosi o wcześniejszy kontakt od przedstawiciela handlowego',
  })
  @IsString()
  others: string;
}
