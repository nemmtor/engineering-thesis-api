import { User, UserRole } from '.prisma/client';

export class CreateUserDto implements Partial<User> {
  email: string;
  name: string;
  password: string;
  role?: UserRole;
}
