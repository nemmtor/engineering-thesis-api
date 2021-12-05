import { ApiProperty } from '@nestjs/swagger';
import { UserWithRole } from './user-with-role';

export class UserLoginResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  user: UserWithRole;
}
