import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Patients } from './entities/patients.entity.js';
import { ListPatientsDto } from './dtos/list-patients.dto.js';
import { CreatePatientDto } from './dtos/create-patient.dto.js';
import { UpdatePatientDto } from './dtos/update-patient.dto.js';
import { BloodGroup, UserRole, Users } from '../users/entities/users.entity.js';

export interface CurrentUser {
    id: number;
    role: UserRole;
}

@Injectable()
export class PatientsService {
    constructor(
        @InjectRepository(Patients) private readonly patientRepo: Repository<Patients>,
        @InjectRepository(Users) private readonly userRepo: Repository<Users>,
    ) {}

    private readonly select = {
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

    async list(q: ListPatientsDto) {
        const page = q.page ?? 1;
        const limit = q.limit ?? 10;
        const [items, total] = await this.patientRepo.findAndCount({
            where: q.search ? { user: { fullname: ILike(`%${q.search}%`) } } : {},
            relations: { user: true },
            select: this.select,
            order: { patientid: 'ASC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { items, total, page, limit };
    }

    async createPatient(dto: CreatePatientDto) {
        const user = await this.userRepo.findOne({ where: { userid: dto.userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        if (user.role !== UserRole.PATIENT) {
            throw new BadRequestException('User role must be PATIENT');
        }
        const exists = await this.patientRepo.findOne({
            where: { user: { userid: dto.userId } },
        });
        if (exists) {
            throw new ConflictException('Patient profile already exists');
        }
        const patient = await this.patientRepo.save(
            this.patientRepo.create({
                user,
                bloodGroup: dto.bloodGroup,
                address: dto.address,
                emergencyContact: dto.emergencyContact,
            }),
        );
        return { patientId: patient.patientid, userId: user.userid };
    }

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

    async getPatientById(id: number, current: CurrentUser) {
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

    async updatePatient(id: number, dto: UpdatePatientDto, current: CurrentUser) {
        await this.getPatientById(id, current);

        const changes: {
            bloodGroup?: BloodGroup;
            address?: string;
            emergencyContact?: string;
        } = {};
        if (dto.bloodGroup !== undefined) changes.bloodGroup = dto.bloodGroup;
        if (dto.address !== undefined) changes.address = dto.address;
        if (dto.emergencyContact !== undefined) {
            changes.emergencyContact = dto.emergencyContact;
        }
        if (Object.keys(changes).length === 0) {
            throw new BadRequestException('No fields to update');
        }
        await this.patientRepo.update(id, changes);
        return this.getPatientById(id, current);
    }
}