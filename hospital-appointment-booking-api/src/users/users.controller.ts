import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dtos/create-user.dto.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create-user')
  async createUser(@Body() user: CreateUserDto): Promise<string>{
    return await this.usersService.createUser(user);
  }
}
