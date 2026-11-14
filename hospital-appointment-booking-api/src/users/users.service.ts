import {ConflictException,Injectable,BadRequestException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users, UserRole } from './entities/users.entity.js';
import { Doctors } from '../doctors/entities/doctors.entity.js';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private readonly userRepo: Repository<Users>,

        @InjectRepository(Doctors)
        private readonly doctorRepo: Repository<Doctors>,
    ) {}

    async createUser(user: CreateUserDto) {
        try {
            const existingUser = await this.userRepo.findOne({
                where: {
                    email: user.email
                },
            });

            if (existingUser) {
                throw new ConflictException('Email Already Registered');
            }

            const hashedPassword = await bcrypt.hash(user.password, 10);

            const u = this.userRepo.create({
                fullname: user.fullname,
                email: user.email,
                contact: user.contact,
                age: user.age,
                gender: user.gender,
                bloodgroup: user.bloodgroup,
                password_hash: hashedPassword,
                role: user.role,
            });

            const savedUser = await this.userRepo.save(u);

            if (savedUser != null) {

                let savedDoctor = null;

                if (user.role === UserRole.DOCTOR) {

                    const doctorObj = this.doctorRepo.create({
                        specialization: user.specialization,
                        consultationFee: user.consultationFee,
                        experienceYear: user.experienceYear,
                        user: savedUser,
                    });

                    savedDoctor = await this.doctorRepo.save(doctorObj);
                }

                return {
                    message: 'User Created Successfully',

                    // user: {
                    //     userid: savedUser.userid,
                    //     fullname: savedUser.fullname,
                    //     email: savedUser.email,
                    //     contact: savedUser.contact,
                    //     age: savedUser.age,
                    //     gender: savedUser.gender,
                    //     bloodgroup: savedUser.bloodgroup,
                    //     role: savedUser.role,
                    // },

                    // ...(savedDoctor && {
                    //     doctor: {
                    //         doctorid: savedDoctor.doctorid,
                    //         specialization: savedDoctor.specialization,
                    //         consultationFee: savedDoctor.consultationFee,
                    //         experienceYear: savedDoctor.experienceYear,
                    //     }
                    //})
                };

            } else {
                return {
                    message: 'User Creation Failed'
                };
            }

        } catch (error) {
            console.error('USER REGISTRATION ERROR:', error);

            if (error instanceof ConflictException) {
                throw error;
            }

            throw new BadRequestException('Database Error');
        }
    }

    async getUserById(id: number): Promise<Users | string> {
        const user = await this.userRepo.findOne({
            where: {
                userid: id
            },
            select: {
                userid: true,
                fullname: true,
                email: true,
                contact: true,
                age: true,
                gender: true,
                bloodgroup: true,
                role: true,
            }
        });

        if (user) {
            return user;
        } else {
            return 'Not Found';
        }
    }
}
