import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User, UserRole } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PromoteUserDto } from './dto/promote-user.dto';
import { UpdateUserDto } from './dto/update-user.dto copy';
import { checkRolePermission } from './helpers/check-role-permission';
import { mapUserRoleToLevel } from './helpers/map-user-role-to-level';
import {
  UsersQueryParams,
  UserWithoutPassword,
  UserWithRole,
} from './user.types';

const userSelect = {
  avatarUrl: true,
  createdAt: true,
  archivedAt: true,
  email: true,
  id: true,
  isActive: true,
  name: true,
  updatedAt: true,
  roleId: true,
};

const userSelectWithRole = {
  ...userSelect,
  role: {
    select: {
      name: true,
    },
  },
};

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserWithoutPassword> {
    try {
      const user = await this.prismaService.user.create({
        data: { ...createUserDto, role: { connect: { id: 1 } } },
        select: userSelectWithRole,
      });

      return user;
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  findAll(query: UsersQueryParams) {
    const where: Prisma.UserWhereInput = {
      role: {
        name: {
          notIn: 'ADMIN',
        },
      },
    };

    if (query.email) {
      where.email = query.email;
    }

    if (query.name) {
      where.name = query.name;
    }

    if (query.role) {
      where.role = {
        name: query.role,
      };
    }

    if (typeof query.isActive === 'boolean') {
      where.isActive = query.isActive;
    }

    if (typeof query.isArchived === 'boolean') {
      where.archivedAt = query.isArchived ? { not: null } : { equals: null };
    }

    return this.prismaService.user.findMany({
      select: userSelectWithRole,
      where,
    });
  }

  async findOne(id: string): Promise<UserWithRole> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: userSelectWithRole,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // Only for login purposes
  async findOneByEmailWithPassword(email: string): Promise<User> {
    const user = await this.prismaService.user.findFirst({
      where: { email },
      select: { ...userSelectWithRole, password: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // Only for change-password purposes
  async findOneByIdWithPassword(id: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: { ...userSelectWithRole, password: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, { email, name, avatarUrl }: UpdateUserDto) {
    try {
      const updatedUser = await this.prismaService.user.update({
        where: { id },
        data: { email, name, avatarUrl },
        select: userSelectWithRole,
      });

      return updatedUser;
    } catch (e) {
      throw new ConflictException(e);
    }
  }

  async changePassword(id: string, password: string) {
    try {
      await this.prismaService.user.update({
        where: { id },
        data: { password },
        select: userSelectWithRole,
      });
    } catch (e) {
      throw new ConflictException(e);
    }
  }

  async remove(id: string, requestingUserRole: UserRole) {
    const user = await this.findOne(id);

    checkRolePermission(requestingUserRole, user.role.name);

    if (user.isActive) {
      await this.prismaService.user.update({
        where: { id },
        data: {
          archivedAt: new Date(),
        },
      });
    } else {
      await this.prismaService.user.delete({
        where: { id },
      });
    }
  }

  async changeRole(
    id: string,
    promoteUserDto: PromoteUserDto,
    requestingUserRole: UserRole,
  ) {
    const user = await this.findOne(id);

    checkRolePermission(requestingUserRole, user.role.name);
    return this.prismaService.user.update({
      where: { id },
      data: {
        role: { connect: { id: mapUserRoleToLevel[promoteUserDto.role] } },
      },
      select: userSelectWithRole,
    });
  }

  async activate(id: string) {
    try {
      await this.prismaService.user.update({
        where: { id },
        data: { isActive: true },
        select: userSelectWithRole,
      });
    } catch (e) {
      throw new NotFoundException('User not found');
    }
  }
}
