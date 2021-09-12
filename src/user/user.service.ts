import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '.prisma/client';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    try {
      const { password, ...createdUser } = await this.prismaService.user.create(
        {
          data: createUserDto,
        },
      );

      return createdUser;
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  async findOne(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findOneByemail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  async remove(id: string) {
    try {
      await this.prismaService.user.delete({
        where: { id },
      });
    } catch (e) {
      throw new NotFoundException();
    }
  }
}
