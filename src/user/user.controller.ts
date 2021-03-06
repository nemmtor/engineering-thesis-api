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
import { ErrorDto } from 'src/docs/swaggerTypes/error';
import { ParseOptionalBoolPipe } from 'src/common/pipes/parse-optional-bool.pipe';
import { User as SwaggerUser } from '../docs/swaggerTypes/user';
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
  @ApiQuery({
    name: 'isActive',
    type: 'boolean',
    required: false,
    example: true,
  })
  @ApiQuery({ name: 'isArchived', type: 'boolean', required: false })
  @ApiResponse({
    type: [SwaggerUser],
    status: 200,
    description: 'Success',
  })
  @ApiBearerAuth('Authorization')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.MANAGER)
  @Get()
  findAll(
    @Query() query: UsersQueryParams,
    @Query('isActive', ParseOptionalBoolPipe) isActive?: boolean,
    @Query('isArchived', ParseOptionalBoolPipe) isArchived?: boolean,
  ) {
    return this.userService.findAll({ ...query, isActive, isArchived });
  }

  @ApiOperation({ summary: 'Get single user' })
  @ApiParam({
    name: 'id',
    type: 'string',
  })
  @ApiResponse({
    type: SwaggerUser,
    status: 200,
    description: 'Success',
  })
  @ApiBearerAuth('Authorization')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.MANAGER)
  @Get(':id')
  findOne(@Param('id', UserByIdPipe) user: User) {
    return user;
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({
    type: [SwaggerUser],
    status: 200,
    description: 'Success',
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
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.MANAGER)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    // TODO: checkRolePermissions here ? maybe as a guard
    await this.userService.remove(id, req.user.role.name);
  }

  @ApiOperation({ summary: 'Activate user' })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @ApiBearerAuth('Authorization')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.MANAGER)
  @Patch('activate/:id')
  activate(@Param('id') id: string) {
    return this.userService.activate(id);
  }

  @ApiOperation({ summary: 'Change role of user' })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @ApiBearerAuth('Authorization')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.MANAGER)
  @Patch('change-role/:id')
  async changeRole(
    @Param('id') id: string,
    @Body() promoteUserDto: PromoteUserDto,
    @Req() req: RequestWithUser,
  ) {
    // TODO: checkRolePermissions here ? maybe as a guard
    return this.userService.changeRole(id, promoteUserDto, req.user.role.name);
  }
}
