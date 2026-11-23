import { Body, Controller, Post,Get,Param,ParseIntPipe, Patch, Delete } from '@nestjs/common';
import { DoctorsService } from './doctors.service.js';
import { CreateDoctorDto } from './dtos/create-doctor.dto.js';
import { Doctors } from './entities/doctors.entity.js';
import { UpdateDoctorDto } from './dtos/update-doctor.dto.js';
import { Public } from '../auth/public.decorator.js';
import { Roles } from '../auth/roles/roles.decorator.js';
import { UserRole } from '../users/entities/users.entity.js';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}


  @Public()
  @Get("test")
  async getHello()
  {
    console.log("controller hit ");
  }

 @Roles(UserRole.ADMIN)
 @Post('create-doctor')
  async createDoctor(
    @Body() doctor: CreateDoctorDto,
  ) {
    return await this.doctorsService.createDoctor(doctor);
  }

  @Roles(UserRole.ADMIN,UserRole.DOCTOR)
  @Get(':id')
  async getDoctorById(@Param('id',ParseIntPipe) id:number){
    return await this.doctorsService.getDoctorById(id);
  }
 
  @Public()
  @Get()
  async getAllDoctors(){
    return await this.doctorsService.getAllDoctors();
  }


  @Public()
  @Get('name/:name')
  async getDoctorByName(@Param('name') name:string){
    return await this.doctorsService.getDoctorByName(name);
  }

  @Public()
  @Get('specialization/:specialization')
  async getDoctorBySpecialization(@Param('specialization') specialization:string){
    return await this.doctorsService.getDoctorBySpecialization(specialization);
  }

  @Roles(UserRole.ADMIN,UserRole.DOCTOR)
  @Patch(':id')
  async UpdateDoctor(
    @Param('id',ParseIntPipe) id:number,
    @Body() doctor:UpdateDoctorDto
  ){
    return await this.doctorsService.updateDoctor(id,doctor);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async deleteDoctor(@Param('id',ParseIntPipe) id:number):Promise<string>{
    return await this.doctorsService.deleteDoctor(id);
  }
}
