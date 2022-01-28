import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddNotificationDto {
  @IsString()
  channel: string;

  @ApiProperty({
    example:
      'Klient prosi o wcześniejszy kontakt od przedstawiciela handlowego',
  })
  @IsString()
  message: string;
}
