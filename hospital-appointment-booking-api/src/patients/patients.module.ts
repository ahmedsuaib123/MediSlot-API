import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsService } from './patients.service.js';
import { PatientsController } from './patients.controller.js';
import { Patients } from './entities/patients.entity.js';
import { Users } from '../users/entities/users.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Patients,Users])],
  providers: [PatientsService],
  controllers: [PatientsController],
})
export class PatientsModule {}
