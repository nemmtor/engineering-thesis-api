import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ example: 'Adam Kowalski' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'adam@kowalski.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'Adam Kowalski FHU' })
  @IsString()
  companyName: string;

  @ApiProperty({ example: '9562305910' })
  @IsString()
  taxNumber: string;

  @ApiProperty({ example: 'Sklep spożywczy' })
  @IsString()
  activityType: string;

  @ApiProperty({ example: 'ul. Kraszewskiego 6/32, 87-100 Toruń' })
  @IsString()
  companyAddress: string;
}
