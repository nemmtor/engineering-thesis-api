import { Injectable, PipeTransform } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class UserByIdPipe implements PipeTransform<string> {
  constructor(private readonly userService: UserService) {}

  async transform(userId: string) {
    throw new Error();
    return this.userService.findOne(userId);
  }
}
