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

    async getDoctorById(id:number):Promise<Doctors|string>{

        const doctor=await this.doctorRepo.findOne(
            {
                where:{
                    doctorid:id,
                },
                relations:{
                    user:true,
                },
                select:{
                    doctorid:true,
                    specialization:true,
                    consultationFee:true,
                    experienceYear:true,
                    created_at:true,
                    updated_at:true,
                    user:{
                        userid:true,
                        fullname:true,
                        email:true,
                        contact:true,
                    },
                }
            }
        );

        if(doctor){
            return doctor;
        } else{
            return 'Doctor Not Found';
        }
    }

    async getAllDoctors(){
        const doctors=await this.doctorRepo.find(
            {
                relations:{
                    user:true,
                },
                select: {
                    doctorid: true,
                    specialization: true,
                    consultationFee: true,
                    experienceYear: true,
                    created_at: true,
                    updated_at: true,

                    user: {
                        userid: true,
                        fullname: true,
                        email: true,
                        contact: true,
                    },
                },
            }
        );

        //return doctors;
        return doctors.map((doctor) => ({
            doctorid: doctor.doctorid,
            userid: doctor.user.userid,
            fullname: doctor.user.fullname,
            email: doctor.user.email,
            contact: doctor.user.contact,
            specialization: doctor.specialization,
            consultationFee: Number(doctor.consultationFee),
            experienceYear: doctor.experienceYear,
        }));
    }
}
