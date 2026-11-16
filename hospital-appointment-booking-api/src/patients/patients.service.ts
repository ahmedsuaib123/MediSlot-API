import { BadRequestException,
        ForbiddenException,
         Injectable,
         NotFoundException,
         } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Patients} from './entities/patients.entity.js';
import {UpdatePatientDto} from './dtos/update-patient.dto.js';
import { BloodGroup, UserRole} from '../users/entities/users.entity.js';

export interface CurrentUser {
    id: number;
    role: UserRole;
}

@Injectable()
export class PatientsService {
    constructor(
        @InjectRepository(Patients) private readonly patientRepo: Repository<Patients>,
    ) {}

    private readonly  select ={
        patientid: true,
        bloodGroup: true,
        address: true,
        emergencyContact: true,
        createdAt: true,
        updatedAt: true,
        user: {
            userid: true,
            fullname: true,
            email: true,
            contact: true,
        },
    } as const;

    async getMyProfile(userId: number) {
        const patient = await this.patientRepo.findOne({
            where: { user: { userid: userId } },
            relations: { user: true },
            select: this.select,
        });
        if (!patient) {
            throw new NotFoundException('Patient not found');
        }
        return patient;
    }

    async getPatientById( id: number, current: CurrentUser) {
        const patient = await this.patientRepo.findOne({
            where: { patientid: id },
            relations: { user: true },
            select: this.select,
        });
        if (!patient) {
            throw new NotFoundException('Patient not found');
        }
        if (current.role !== UserRole.ADMIN && patient.user.userid !== current.id) {
            throw new ForbiddenException('You can only access your own profile');
        }
        return patient;
    }

    async updatePatient (id: number, dto: UpdatePatientDto, current: CurrentUser) {
        await this.getPatientById(id, current);

        const changes: {
            bloodGroup?: BloodGroup;
            address?: string;
            emergencyContact?: string;
        } = {};
        if (dto.bloodGroup !== undefined) changes.bloodGroup = dto.bloodGroup;
        if (dto.address !== undefined) changes.address = dto.address;
        if (dto.emergencyContact !== undefined){
            changes.emergencyContact = dto.emergencyContact;

        } 
         if (Object.keys(changes).length === 0) {
            throw new BadRequestException('No fields to update');
        }
        await this.patientRepo.update( id , changes);
        return this.getPatientById(id, current);
    }
}
