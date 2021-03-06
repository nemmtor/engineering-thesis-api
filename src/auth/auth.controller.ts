import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserLoginRequestPayload } from 'src/docs/swaggerTypes/user-login-request-payload';
import { UserLoginResponse } from 'src/docs/swaggerTypes/user-login-response';
import { User } from 'src/docs/swaggerTypes/user';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { ErrorDto } from 'src/docs/swaggerTypes/error';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/common/guards/roles/roles.decorator';
import { Response } from 'express';
import { ChangePasswordDto } from 'src/user/dto/change-password.dto';
import { SelfGuard } from 'src/user/guards/self.guard';
import { AuthService } from './auth.service';
import { RequestWithUser, RequestWithUserId } from './auth.types';
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
    type: User,
    status: 201,
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
  @ApiBody({ type: UserLoginRequestPayload })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: RequestWithUserId, @Res() response: Response) {
    const jwtPayload = req.user;

    const resBody = await this.authService.login(jwtPayload);

    response
      .status(201)
      .cookie('accessToken', resBody.accessToken, {
        httpOnly: true,
        sameSite: false,
        domain: process.env.ENV === 'production' ? 'after-sale.pl' : undefined,
        secure: process.env.ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24,
      })
      .json(resBody);
  }

  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({
    description: 'Success',
    status: 200,
  })
  @Post('logout')
  async logout(@Res() response: Response) {
    response
      .status(200)
      .clearCookie('accessToken', {
        httpOnly: true,
        sameSite: false,
        domain: process.env.ENV === 'production' ? 'after-sale.pl' : undefined,
        secure: process.env.ENV === 'production',
      })
      .send();
  }

  @ApiOperation({ summary: 'Login for mobile app' })
  @ApiResponse({
    description: 'Success',
    type: UserLoginResponse,
    status: 201,
  })
  @ApiBody({ type: UserLoginRequestPayload })
  @UseGuards(LocalAuthGuard, RolesGuard)
  @Roles(UserRole.SALES_REPRESENTATIVE)
  @Post('login-mobile')
  async loginMobile(@Req() req: RequestWithUser) {
    const { id } = req.user;

    return this.authService.login({ id });
  }

  @ApiOperation({ summary: 'Get current logged user' })
  @ApiResponse({
    description: 'Success',
    type: User,
    status: 200,
  })
  @ApiBearerAuth('Authorization')
  @UseGuards(JwtGuard)
  @Get('me')
  async getMe(@Req() req: RequestWithUser) {
    return this.userService.findOne(req.user.id);
  }

  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({
    description: 'Password changed',
    status: 201,
  })
  @ApiBody({ type: ChangePasswordDto })
  @ApiBearerAuth('Authorization')
  @UseGuards(JwtGuard, SelfGuard)
  @Post('change-password/:id')
  async changePassword(
    @Req() req: RequestWithUser,
    @Param('id') userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changeUserPassword(
      userId,
      changePasswordDto,
      req.user,
    );
  }
}
