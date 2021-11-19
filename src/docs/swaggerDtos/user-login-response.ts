import { ApiProperty } from '@nestjs/swagger';
import { UserWithRole } from './user-without-password';

export class UserLoginResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  user: UserWithRole;
}
