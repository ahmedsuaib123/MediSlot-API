import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctors } from './entities/doctors.entity.js';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service.js';
import { CreateDoctorDto } from './dtos/create-doctor.dto.js';

@Injectable()
export class DoctorsService {
    constructor(
        @InjectRepository(Doctors)
        private readonly doctorsRepo: Repository<Doctors>,
        private readonly usersService: UsersService,
    ){}

    async createDoctor(doctor: CreateDoctorDto): Promise<Doctors | string>{
        try{
            const usr=await this.usersService.getUserById(doctor.userId)
        } catch{

        }
    }
}
