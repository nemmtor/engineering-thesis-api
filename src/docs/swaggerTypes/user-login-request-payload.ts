import { ApiProperty } from '@nestjs/swagger';

export class UserLoginRequestPayload {
  @ApiProperty({ example: 'admin@admin.com' })
  email: string;

  @ApiProperty({ example: 'admin' })
  password: string;
}
