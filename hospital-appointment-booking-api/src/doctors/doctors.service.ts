import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctors } from './entities/doctors.entity.js';
import { Repository,ILike } from 'typeorm';
import { UsersService } from '../users/users.service.js';
import { CreateDoctorDto } from './dtos/create-doctor.dto.js';
import { Users } from '../users/entities/users.entity.js';
import { BadRequestException,NotFoundException } from '@nestjs/common';
import { UpdateDoctorDto } from './dtos/update-doctor.dto.js';

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

    async getDoctorByName(name: string) {
        const doctors = await this.doctorRepo.find({
            where: {
                user: {
                    fullname: ILike(`%${name}%`),
                },
            },
            relations: {
                user: true,
            },
            select: {
                doctorid: true,
                specialization: true,
                consultationFee: true,
                experienceYear: true,
                user: {
                    userid: true,
                    fullname: true,
                    email: true,
                    contact: true,
                },
            },
        });

        if (doctors.length > 0) {
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
        } else {
            return 'Doctor Not Found';
        }
    }
    
    async getDoctorBySpecialization(specialization: string) {
        const doctors = await this.doctorRepo.find({
            where: {
                specialization: ILike(`%${specialization}%`),
            },
            relations: {
                user: true,
            },
            select: {
                doctorid: true,
                specialization: true,
                consultationFee: true,
                experienceYear: true,
                user: {
                    userid: true,
                    fullname: true,
                    email: true,
                    contact: true,
                },
            },
        });

        if (doctors.length > 0) {
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
        } else {
            return 'Doctor Not Found';
        }
    }

    async updateDoctor(id: number, doctor: UpdateDoctorDto) {
        try {
            const existingDoctor = await this.doctorRepo.findOne({
                where: {
                    doctorid: id,
                },
            });

            if (existingDoctor) {

                existingDoctor.specialization =
                    doctor.specialization ?? existingDoctor.specialization;

                existingDoctor.consultationFee =
                    doctor.consultationFee ?? existingDoctor.consultationFee;

                existingDoctor.experienceYear =
                    doctor.experienceYear ?? existingDoctor.experienceYear;

                return await this.doctorRepo.save(existingDoctor);

            } else {
                throw new NotFoundException('Doctor Not Found');
            }

        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            throw new BadRequestException('Doctor Update Failed');
        }
    }
}
