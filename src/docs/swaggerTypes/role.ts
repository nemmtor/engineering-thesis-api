import { ApiProperty } from '@nestjs/swagger';
import { Role as PrismaRole, UserRole } from '.prisma/client';

export class Role implements PrismaRole {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'USER' })
  name: UserRole;
}
