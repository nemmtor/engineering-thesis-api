import { ApiProperty } from '@nestjs/swagger';
import { UserWithoutPassword } from './user-without-password';

export class UserLoginResponse {
  @ApiProperty()
  token: string;

  @ApiProperty()
  user: UserWithoutPassword;
}
