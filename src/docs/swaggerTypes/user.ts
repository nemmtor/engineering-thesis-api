import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User as PrismaUser } from '@prisma/client';
import { Role } from './role';

export class User implements Omit<PrismaUser, 'password'> {
  @ApiProperty({ example: '81cbfd3b-7c93-4c83-ada1-d408d8f6a8c8' })
  id: string;

  @ApiProperty({ example: new Date() })
  createdAt: Date;

  @ApiProperty({ example: new Date() })
  updatedAt: Date;

  @ApiProperty({ example: new Date() })
  archivedAt: Date;

  @ApiProperty({ example: 'Marian Nowak' })
  name: string;

  @ApiProperty({ example: 'marian@nowak.com' })
  email: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: 1 })
  roleId: number;

  @ApiProperty()
  role: Role;

  @ApiPropertyOptional({
    example:
      'https://scontent.fpoz1-1.fna.fbcdn.net/v/t1.6435-9/64253042_2281769281892166_3720570498820603904_n.jpg?_nc_cat=103&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=h2tbt-nU0tUAX9z-AWE&tn=qOytngkq7HwWCWyI&_nc_ht=scontent.fpoz1-1.fna&oh=12fe91eac78cdb3ba21afad6a4443f54&oe=61D3A9E3',
  })
  avatarUrl: string;
}
