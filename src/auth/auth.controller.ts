import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorDto } from 'src/common/errors/error.dto';
import { UserLoginRequest } from 'src/docs/swaggerDtos/user-login-request';
import { UserLoginResponse } from 'src/docs/swaggerDtos/user-login-response';
import { UserWithoutPassword } from 'src/docs/swaggerDtos/user-without-password';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { RequestWithUser } from './auth.types';
import { JwtGuard } from '../jwt/guards/jwt.guard';
import { LocalAuthGuard } from './guards/local.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @ApiOperation({ summary: 'Register' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    description: 'Success',
    type: UserWithoutPassword,
    status: 201,
  })
  @ApiResponse({
    description: 'Bad request',
    status: 400,
    type: ErrorDto,
  })
  @ApiResponse({
    description: 'Email is already taken',
    status: 409,
    type: ErrorDto,
  })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @ApiOperation({ summary: 'Login' })
  @ApiResponse({
    description: 'Success',
    type: UserLoginResponse,
    status: 201,
  })
  @ApiResponse({
    description: 'Unauthorized',
    type: ErrorDto,
    status: 401,
  })
  @ApiBody({ type: UserLoginRequest })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: RequestWithUser) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: 'Get current logged user' })
  @ApiResponse({
    description: 'Success',
    type: UserWithoutPassword,
    status: 200,
  })
  @ApiResponse({
    description: 'Unauthorized',
    type: ErrorDto,
    status: 401,
  })
  @ApiBearerAuth('Authorization')
  @UseGuards(JwtGuard)
  @Get('me')
  async getMe(@Req() req: RequestWithUser) {
    return this.userService.findOne(req.user.id);
  }
}
