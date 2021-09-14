import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

enum UserRoleWithoutAdmin {
  MANAGER = 'MANAGER',
  QUALITY_CONTROLLER = 'QUALITY_CONTROLLER',
  SALES_REPRESENTATIVE = 'SALES_REPRESENTATIVE',
  USER = 'USER',
}

export class PromoteUserDto {
  @ApiProperty()
  @IsEnum(UserRoleWithoutAdmin)
  role: UserRoleWithoutAdmin;
}
