import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User, UserRole } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PromoteUserDto } from './dto/promote-user.dto';
import { mapUserRoleToLevel } from './helpers/map-user-role-to-level';

type UserSelect = Record<keyof Omit<User, 'password'>, boolean>;
type UserWithoutPassword = Omit<User, 'password'>;

const userSelect: UserSelect = {
  avatarUrl: true,
  createdAt: true,
  email: true,
  id: true,
  isActive: true,
  name: true,
  role: true,
  updatedAt: true,
};

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserWithoutPassword> {
    try {
      const user = await this.prismaService.user.create({
        data: createUserDto,
        select: userSelect,
      });

      return user;
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  findAll() {
    return this.prismaService.user.findMany({
      select: userSelect,
    });
  }

  async findOne(id: string): Promise<UserWithoutPassword> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: userSelect,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findOneByEmail(email: string): Promise<UserWithoutPassword> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      select: userSelect,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // Only for login purposes
  async findOneByEmailWithPassword(email: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      select: { ...userSelect, password: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  async remove(id: string, requestingUserRole: UserRole) {
    const user = await this.findOne(id);

    await this.checkRolePermission(requestingUserRole, user.role);

    await this.prismaService.user.delete({
      where: { id },
    });
  }

  async checkRolePermission(
    requestingUserRole: UserRole,
    targetUserRole: UserRole,
  ) {
    const requestingUserLevel = mapUserRoleToLevel[requestingUserRole];
    const targetUserLevel = mapUserRoleToLevel[targetUserRole];

    if (requestingUserLevel <= targetUserLevel) {
      throw new UnauthorizedException();
    }
  }

  async changeRole(
    id: string,
    promoteUserDto: PromoteUserDto,
    requestingUserRole: UserRole,
  ) {
    const user = await this.findOne(id);

    await this.checkRolePermission(requestingUserRole, user.role);

    return this.prismaService.user.update({
      where: { id },
      data: { role: promoteUserDto.role },
      select: userSelect,
    });
  }

  async activate(id: string) {
    try {
      await this.prismaService.user.update({
        where: { id },
        data: { isActive: true },
        select: userSelect,
      });
    } catch (e) {
      throw new NotFoundException('User not found');
    }
  }
}
