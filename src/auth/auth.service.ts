import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from 'src/jwt/jwt.service';
import { UserJwtPayload } from 'src/jwt/types/jwt-payload.type';
import { User } from '@prisma/client';
import { UserWithoutPassword } from 'src/user/user.types';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserWithoutPassword> {
    let user: User;

    try {
      user = await this.userService.findOneByEmailWithPassword(email);
    } catch (e) {
      throw new UnauthorizedException();
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      throw new UnauthorizedException();
    }

    if (!user.isActive) {
      throw new UnauthorizedException();
    }

    const { password: removedPassword, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  async login(userJwtPayload: UserJwtPayload) {
    return {
      accessToken: this.jwtService.encryptUser(userJwtPayload),
    };
  }

  async register(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = { ...createUserDto, password: hashedPassword };

    const createdUser = this.userService.create(newUser);

    return createdUser;
  }
}
