import { ApiProperty } from '@nestjs/swagger';
import { StatusType } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class ChangeSaleStatusDto {
  @ApiProperty({ example: 'das-123-llaa' })
  @IsString()
  saleId: string;

  @ApiProperty({ example: 'SIGN_ACCEPTED' })
  @IsString()
  status: StatusType;

  @ApiProperty({ example: 'Inne uwagi' })
  @IsOptional()
  @IsString()
  message?: string;
}
