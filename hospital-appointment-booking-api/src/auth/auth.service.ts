import {ConflictException,
        Injectable,
        NotFoundException,
        UnauthorizedException,

 } from '@nestjs/common';

 import {InjectRepository} from '@nestjs/typeorm';
 import {JwtService} from '@nestjs/jwt';
 import {DataSource, Repository} from 'typeorm';
 import * as bcrypt from 'bcrypt';
 import {UserRole, Users } from '../users/entities/users.entity.js';
 import {Patients} from '../patients/entities/patients.entity.js';
 import {RegisterDto} from './dtos/register.dto.js';
 import {LoginDto} from './dtos/login.dto.js';


@Injectable()
export class AuthService {

     constructor(
        @InjectRepository(Users) private readonly userRepo: Repository<Users>,
        private readonly dataSource: DataSource,
        private readonly jwtService : JwtService,
    ) {}

    async register(dto: RegisterDto) {
        const hash = await bcrypt.hash(dto.password, 10);
        try{
       return await this.dataSource.transaction(async manager => {
            const user = await manager.save(
                manager.create(Users, {
                fullname: dto.fullName,
                email: dto.email,
                contact: dto.contact,
                age:dto.age,
                gender:dto.gender,
                bloodGroup:dto.bloodGroup,
                role: UserRole.PATIENT,
                password_hash : hash,
            }),
        );
        const patient = await manager.save(
            manager.create(Patients, {
                user: user,
                bloodGroup: dto.bloodGroup,
                address: dto.address,
                emergencyContact: dto.emergencyContact,
            }),
        );
        return {
            userId: user.userid,
            patientId: patient.patientid,
            email: user.email,
        };
    });
        }catch (err: any) {
            const code = err?.driverError?.code;
            if (code === '23505') {
                throw new ConflictException('Email already registered');
            }
            throw err;
    }
}

async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) {
        throw new UnauthorizedException('Invalid email or password');
    }
    const isMatch = await bcrypt.compare(dto.password, user.password_hash);
    if (!isMatch) {
        throw new UnauthorizedException('Invalid email or password');

    }
    const payload = { id: user. userid, email: user.email, role: user.role };
    return{accessToken: this.jwtService.sign(payload)};
}

async me(id: number) {
        const user = await this.userRepo.findOne({ where: { userid: id } });
if (!user) {
    throw new NotFoundException('User not found');
}
const {password_hash: _hash, ...account} =user;

let profile Patients | null = null;
if (user.role === UserRole.PATIENT) {
    profile = await this.dataSource.getRepository(Patients).findOne({
        where: { user: { userid: id } },
    });
}
return {
    account,
    profile,
};
        
    }

}
