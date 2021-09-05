import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaError } from 'src/prisma/error.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const createdUser = await this.prismaService.user.create({
        data: createUserDto,
      });

      return createdUser;
    } catch (e) {
      if (e.code === PrismaError.UniqueConstraintFailed) {
        throw new ConflictException({
          // TODO: e.meta.target is array
          [e.meta.target]: 'Unique constraint violation',
        });
      }
      throw new ConflictException();
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
      throw new NotFoundException();
    }

    return user;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
