import { Controller, Get, Param } from '@nestjs/common';
import { UserByIdPipe } from 'src/common/pipes/user-by-id.pipe';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorDto } from 'src/common/errors/error.dto';
import { User } from '.prisma/client';
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

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
