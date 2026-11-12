import { Body, Controller, Post } from '@nestjs/common';
import { DoctorsService } from './doctors.service.js';
import { CreateDoctorDto } from './dtos/create-doctor.dto.js';
import { Doctors } from './entities/doctors.entity.js';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post('create-doctor')
  async createDoctor(@Body() doctor: CreateDoctorDto): Promise<Doctors|string>{
    return await this.doctorsService.createDoctor(doctor);
  }
}
