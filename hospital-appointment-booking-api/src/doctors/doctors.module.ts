import { Module } from '@nestjs/common';
import { DoctorsService } from './doctors.service.js';
import { DoctorsController } from './doctors.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctors } from  './entities/doctors.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Doctors])],
  controllers: [DoctorsController],
  providers: [DoctorsService],
})
export class DoctorsModule {}
