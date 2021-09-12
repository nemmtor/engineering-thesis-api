import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { RequestWithUserJwtPayload } from 'src/auth/types/request-with-user-jwt-payload';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: RequestWithUserJwtPayload) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: RequestWithUserJwtPayload) {
    return this.userService.findOne(req.user.id);
  }
}
