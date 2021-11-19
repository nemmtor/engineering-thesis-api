import { ApiProperty } from '@nestjs/swagger';
import { Users } from '@prisma/client';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto implements Partial<Users> {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty()
  @IsString()
  password: string;
}
