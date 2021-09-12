import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { UserByIdPipe } from 'src/user/pipes/user-by-id.pipe';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorDto } from 'src/common/errors/error.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ActiveGuard } from 'src/auth/guards/active.guard';
import { User, UserRole } from '.prisma/client';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // @ApiOperation({ summary: 'Creates user' })
  // @ApiResponse({
  //   description: 'User created',
  //   type: UserDto,
  //   status: 201,
  // })
  // @ApiResponse({
  //   description: 'Bad request',
  //   status: 400,
  //   type: ErrorDto,
  // })
  // @ApiResponse({
  //   description: 'Email is already taken',
  //   status: 409,
  //   type: ErrorDto,
  // })
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    type: [UserDto],
    status: 200,
  })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific user' })
  @ApiParam({
    name: 'id',
    type: 'string',
  })
  @ApiResponse({ type: UserDto, status: 200 })
  @ApiResponse({ type: ErrorDto, status: 404 })
  findOne(@Param('id', UserByIdPipe) user: User) {
    return user;
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  @UseGuards(JwtAuthGuard, ActiveGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.userService.remove(id);
  }
}
