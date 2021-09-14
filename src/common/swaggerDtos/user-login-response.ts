import { ApiProperty } from '@nestjs/swagger';

export class UserLoginResponse {
  @ApiProperty()
  token: string;
}
