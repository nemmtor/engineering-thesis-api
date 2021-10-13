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
import { RequestWithUser } from 'src/auth/auth.types';
import { Roles } from 'src/common/guards/roles/roles.decorator';
import { JwtGuard } from 'src/jwt/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { UserByIdPipe } from 'src/user/pipes/user-by-id.pipe';
import { ErrorDto } from 'src/docs/swaggerDtos/error';
import { UserWithoutPassword } from '../docs/swaggerDtos/user-without-password';
import { PromoteUserDto } from './dto/promote-user.dto';
import { UpdateUserDto } from './dto/update-user.dto copy';
import { SelfGuard } from './guards/self.guard';
import { UserService } from './user.service';
import { UsersQueryParams } from './user.types';

@ApiTags('User')
@Controller('user')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({ name: 'name', type: 'string', required: false })
  @ApiQuery({ name: 'email', type: 'string', required: false })
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
  @UseGuards(JwtGuard)
  @Get()
  findAll(@Query() query: UsersQueryParams) {
    return this.userService.findAll(query);
  }

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
  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id', UserByIdPipe) user: User) {
    return user;
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({
    type: [UserWithoutPassword],
    status: 200,
    description: 'Success',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    type: ErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: ErrorDto,
  })
  @ApiBearerAuth('Authorization')
  @UseGuards(JwtGuard, SelfGuard)
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
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
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    // TODO: checkRolePermissions here ? maybe as a guard
    await this.userService.remove(id, req.user.role);
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
  @UseGuards(JwtGuard, RolesGuard)
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
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Patch('change-role/:id')
  async changeRole(
    @Param('id') id: string,
    @Body() promoteUserDto: PromoteUserDto,
    @Req() req: RequestWithUser,
  ) {
    // TODO: checkRolePermissions here ? maybe as a guard
    return this.userService.changeRole(id, promoteUserDto, req.user.role);
  }
}
