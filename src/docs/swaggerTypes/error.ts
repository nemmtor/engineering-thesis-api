import { ApiProperty } from '@nestjs/swagger';

export class ErrorDto {
  @ApiProperty({ example: ['email has to be unique'] })
  errors: string[];
}
