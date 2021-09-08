import { IsString, IsEnum, IsEmail, MinLength } from 'class-validator';
import { User, UserRole } from '.prisma/client';

export class CreateUserDto implements Partial<User> {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  name: string;

  // TODO: Validate password
  @IsString()
  password: string;

  @IsEnum(UserRole)
  role?: UserRole;
}
