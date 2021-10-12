import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User, UserRole } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RequestWithUserJwtPayload } from 'src/auth/types/request-with-user-jwt-payload';
import { ErrorDto } from 'src/common/errors/error.dto';
import { UserByIdPipe } from 'src/user/pipes/user-by-id.pipe';
import { UserWithoutPassword } from '../common/swaggerDtos/user-without-password';
import { PromoteUserDto } from './dto/promote-user.dto';
import { UserService } from './user.service';
import { UsersQueryParams } from './user.types';

@ApiTags('User')
@Controller('user')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({ name: 'name', type: 'string' })
  @ApiQuery({ name: 'email', type: 'string' })
  @ApiResponse({
    type: [UserWithoutPassword],
    status: 200,
    description: 'Success',
  })
  @ApiResponse({
    type: ErrorDto,
    status: 401,
    description: 'Unuathorized',
  })
  @ApiBearerAuth('Authorization')
  @UseGuards(JwtAuthGuard)
  findAll(@Query() query: UsersQueryParams) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single user' })
  @ApiParam({
    name: 'id',
    type: 'string',
  })
  @ApiResponse({
    type: UserWithoutPassword,
    status: 200,
    description: 'Success',
  })
  @ApiResponse({ type: ErrorDto, status: 404, description: 'User not found' })
  @ApiResponse({
    type: ErrorDto,
    status: 401,
    description: 'Unuathorized',
  })
  @ApiBearerAuth('Authorization')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', UserByIdPipe) user: User) {
    return user;
  }

  @ApiOperation({ summary: 'Activate user' })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: ErrorDto,
  })
  @ApiBearerAuth('Authorization')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Patch('activate/:id')
  activate(@Param('id') id: string) {
    return this.userService.activate(id);
  }

  @ApiOperation({ summary: 'Change role of user' })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: ErrorDto,
  })
  @ApiBearerAuth('Authorization')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Patch('change-role/:id')
  async changeRole(
    @Param('id') id: string,
    @Body() promoteUserDto: PromoteUserDto,
    @Req() req: RequestWithUserJwtPayload,
  ) {
    return this.userService.changeRole(id, promoteUserDto, req.user.role);
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @ApiResponse({
    type: ErrorDto,
    status: 401,
    description: 'Unuathorized',
  })
  @ApiResponse({
    type: ErrorDto,
    status: 404,
    description: 'User not found',
  })
  @ApiBearerAuth('Authorization')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: RequestWithUserJwtPayload) {
    await this.userService.remove(id, req.user.role);
  }
}
