import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsString } from 'class-validator';
import { SaleLength, SalePrice } from '../sale.types';

export class CreateContractDto {
  @ApiProperty({ example: 129 })
  @IsEnum(SalePrice)
  price: number;

  @ApiProperty({ example: 24 })
  @IsEnum(SaleLength)
  length: number;

  @ApiProperty({ example: 'ul. Polna 11/20, 87-100 Toruń' })
  @IsString()
  signAddress: string;

  @ApiProperty({ example: new Date() })
  @IsDate()
  plannedSignAt: Date;
}
