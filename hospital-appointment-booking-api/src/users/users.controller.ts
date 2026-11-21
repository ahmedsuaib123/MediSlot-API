import {Body,Controller,Post,Get,Patch,Delete,Param,ParseIntPipe,Query,Req,DefaultValuePipe} from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dtos/create-user.dto.js';
import { UpdateUserDto } from './dtos/update-user.dto.js';
import { UserRole } from './entities/users.entity.js';
import { Roles } from '../auth/roles/roles.decorator.js';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  getAllUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('role') role?: UserRole,
  ) {
    return this.usersService.getAllUsers(page, limit, role);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserById(id);
  }

  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ) {
    const currentUser = (req as Request & {
      user: { id: number; role: UserRole };
    }).user;

    return this.usersService.updateUser(
      id,
      updateUserDto,
      currentUser.id,
      currentUser.role,
    );
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  deactivateUser(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    const currentUser = (req as Request & {
      user: { id: number; role: UserRole };
    }).user;

    return this.usersService.deactivateUser(id, currentUser.role);
  }
}
