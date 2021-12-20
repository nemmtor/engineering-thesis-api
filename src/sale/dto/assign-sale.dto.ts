import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AssignSaleDto {
  @ApiProperty({ example: 'das-123-llaa' })
  @IsString()
  saleId: string;

  @ApiProperty({ example: 'asd-123-4321' })
  @IsOptional()
  @IsString()
  userId?: string;
}
