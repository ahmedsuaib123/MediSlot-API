import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctors } from './entities/doctors.entity.js';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service.js';
import { CreateDoctorDto } from './dtos/create-doctor.dto.js';
import { Users } from '../users/entities/users.entity.js';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class DoctorsService {
    constructor(
        @InjectRepository(Doctors)
        private readonly doctorRepo: Repository<Doctors>,
        private readonly usersService: UsersService,
    ){}

    async createDoctor(doctor: CreateDoctorDto): Promise<Doctors | string>{
        try{
            const usr=await this.usersService.getUserById(doctor.userId);

            if(usr!=null && typeof usr !=='string'){
                const doctorObj=await this.doctorRepo.create(
                    {
                        specialization: doctor.specialization,
                        consultationFee:doctor.consultationFee,
                        experienceYear:doctor.experienceYear,
                        user:usr as Users,
                    }
                );
                return await this.doctorRepo.save(doctorObj); 
            } else {
                return 'User not found';
            }
        } catch{
            throw new BadRequestException('doctor creation failed');
        }
    }
}
