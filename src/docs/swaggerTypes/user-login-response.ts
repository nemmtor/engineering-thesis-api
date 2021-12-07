import { ApiProperty } from '@nestjs/swagger';
import { User } from './user';

export class UserLoginResponse {
  @ApiProperty({
    example:
      'eyJcbGciOiJIUzI1NiIsIna5cCI6IkpXVCJ9.eyahdmF0YXJ1cmwiOm51bGwsI3NyZWF0ZWRB5CI6IjIwMjEtMTItMDJUMjI6MTM6NTcuOTM1WiIsImFyY2hpdmVkQXQiOm51bGwsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwiaWQiOiJja3dwaW01bnowMDAwdmV1OW84ZWh4ZHAwIiwiaXNBY3RpdmUiOnRydWUsIm5hbWUiOiJBZG1pbiBBZG1pbiIsInVwZGF0ZWRBdCI6IjIwMjEtMTItMDNUMjA6Mzc6MDQuNDg0WiIsInJvbGVJZCI6NSwicm9sZSI6eyJuYW1lIjoiQURNSU4ifSwiaWF0IjoxNjM4OTE0MjU0LCJleHAiOjE2MzkwMDA2NTR9.tEUEcuHRHH92or6zOqmr2F6ulJzlEUf7zTOt4p4vkrc',
  })
  accessToken: string;

  @ApiProperty()
  user: User;
}
