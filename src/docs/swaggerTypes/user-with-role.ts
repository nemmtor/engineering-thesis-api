import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole, User } from '@prisma/client';

export class UserWithRole implements Omit<User, 'password'> {
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
    role: UserRole;
  };

  @ApiPropertyOptional({})
  avatarUrl: string;
}
