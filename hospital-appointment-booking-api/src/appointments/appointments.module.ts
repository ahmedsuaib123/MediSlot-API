import { Module } from '@nestjs/common';
import { TypeOrmModule} from '@nestjs/typeorm';
import { AppointmentsService } from './appointments.service.js';
import { AppointmentsController } from './appointments.controller.js';
import { Appointments } from './entities/appointments.entity.js';
import { Patients } from '../patients/entities/patients.entity.js';
import { Slots } from '../slots/entities/slots.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Appointments,Patients,Slots])],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
