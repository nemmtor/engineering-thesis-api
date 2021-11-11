import { ApiProperty } from '@nestjs/swagger';
import { UserWithoutPassword } from './user-without-password';

export class UserLoginResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  user: UserWithoutPassword;
}
