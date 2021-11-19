import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Users } from '@prisma/client';

export class UserWithRole implements Omit<Users, 'password'> {
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

  @ApiProperty()
  role: {
    role: string;
  };

  @ApiPropertyOptional({})
  avatarUrl: string;
}
