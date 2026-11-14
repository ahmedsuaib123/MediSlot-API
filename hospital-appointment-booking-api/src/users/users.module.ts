import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
//import { DoctorsModule } from '../doctors/doctors.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/users.entity.js';
import { Doctors } from '../doctors/entities/doctors.entity.js';

@Module({
  imports:[TypeOrmModule.forFeature([Users,Doctors])],
  controllers: [UsersController],
  providers: [UsersService],
  exports:[UsersService]
})
export class UsersModule {}
