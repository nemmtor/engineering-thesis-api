import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Users } from '@prisma/client';

export class UserWithoutPassword implements Omit<Users, 'password'> {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  archivedAt: Date;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  roleId: number;

  @ApiPropertyOptional({})
  avatarUrl: string;
}
