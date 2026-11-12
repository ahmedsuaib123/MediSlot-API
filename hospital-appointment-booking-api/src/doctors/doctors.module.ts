import { Module } from '@nestjs/common';
import { DoctorsService } from './doctors.service.js';
import { DoctorsController } from './doctors.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctors } from  './entities/doctors.entity.js';
import { UsersModule } from '../users/users.module.js';
// import { Users } from '../users/entities/users.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Doctors]),UsersModule],
  controllers: [DoctorsController],
  providers: [DoctorsService],
})
export class DoctorsModule {}
