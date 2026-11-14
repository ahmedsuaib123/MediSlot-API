import { Body, Controller, Post,Get,Param,ParseIntPipe } from '@nestjs/common';
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

  @Get(':id')
  async getDoctorById(@Param('id',ParseIntPipe) id:number){
    return await this.doctorsService.getDoctorById(id);
  }

  @Get()
  async getAllDoctors(){
    return await this.doctorsService.getAllDoctors();
  }

  @Get('name/:name')
  async getDoctorByName(@Param('name') name:string){
    return await this.doctorsService.getDoctorByName(name);
  }

  @Get('specialization/:specialization')
  async getDoctorBySpecialization(@Param('specialization') specialization:string){
    return await this.doctorsService.getDoctorBySpecialization(specialization);
  }
}
