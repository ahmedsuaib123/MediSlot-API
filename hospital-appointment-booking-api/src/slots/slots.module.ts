import { Module } from '@nestjs/common';
import { SlotsService } from './slots.service.js';
import { SlotsController } from './slots.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slots } from './entities/slots.entity.js';
import { DoctorsModule } from '../doctors/doctors.module.js';

@Module({
  imports:[TypeOrmModule.forFeature([Slots]),DoctorsModule],
  controllers: [SlotsController],
  providers: [SlotsService],
})
export class SlotsModule {}

