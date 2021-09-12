import {
  IsString,
  IsEnum,
  IsEmail,
  MinLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User, UserRole } from '.prisma/client';

export class CreateUserDto implements Partial<User> {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  name: string;

  // TODO: Validate password
  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty({ enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
