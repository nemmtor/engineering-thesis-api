import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from 'src/jwt/jwt.service';
import { User } from '@prisma/client';
import { UserWithoutPassword, UserWithRole } from 'src/user/user.types';
import { UserJwtPayload } from 'src/jwt/jwt.types';
import { ChangePasswordDto } from 'src/user/dto/change-password.dto';

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

    if (!user.isActive || !!user.archivedAt) {
      throw new UnauthorizedException();
    }

    const { password: removedPassword, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  async login(userJwtPayload: UserJwtPayload) {
    return {
      accessToken: this.jwtService.encryptUser(userJwtPayload),
      user: await this.userService.findOne(userJwtPayload.id),
    };
  }

  async register(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = { ...createUserDto, password: hashedPassword };

    const createdUser = this.userService.create(newUser);

    return createdUser;
  }

  async changeUserPassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
    requestingUser: UserWithRole,
  ) {
    if (changePasswordDto.newPassword !== changePasswordDto.newPasswordRepeat) {
      throw new BadRequestException();
    }

    const omitPasswordCheck =
      ['ADMIN', 'MANAGER'].includes(requestingUser.role.name) &&
      userId !== requestingUser.id;

    if (!omitPasswordCheck) {
      if (!changePasswordDto.oldPassword) throw new Error();
      const user = await this.userService.findOneByIdWithPassword(userId);

      const passwordsMatch = await bcrypt.compare(
        changePasswordDto.oldPassword,
        user.password,
      );

      if (!passwordsMatch) throw new UnauthorizedException();
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

    await this.userService.changePassword(userId, hashedPassword);
  }
}
