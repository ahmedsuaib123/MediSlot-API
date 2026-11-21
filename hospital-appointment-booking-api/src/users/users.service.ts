import {Injectable,ConflictException,NotFoundException,BadRequestException,ForbiddenException} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  DataSource,
  QueryFailedError,
} from 'typeorm';

import * as bcrypt from 'bcrypt';

import { Users, UserRole } from './entities/users.entity.js';
import { Doctors } from '../doctors/entities/doctors.entity.js';

import { CreateUserDto } from './dtos/create-user.dto.js';
import { UpdateUserDto } from './dtos/update-user.dto.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>,

    @InjectRepository(Doctors)
    private readonly doctorRepo: Repository<Doctors>,

    private readonly dataSource: DataSource,
  ) {}

  async createUser(user: CreateUserDto) {
    try {
      const result = await this.dataSource.transaction(
        async (manager) => {
          const existingUser = await manager.findOne(Users, {
            where: { email: user.email },
          });

          if (existingUser) {
            throw new ConflictException('Email Already Registered');
          }

          if (
            user.role === UserRole.DOCTOR &&
            (!user.specialization ||
              user.consultationFee === undefined ||
              user.experienceYear === undefined)
          ) {
            throw new BadRequestException(
              'Doctor information is required',
            );
          }

          const hashedPassword = await bcrypt.hash(
            user.password,
            10,
          );

          const newUser = manager.create(Users, {
            fullname: user.fullname,
            email: user.email,
            contact: user.contact,
            age: user.age,
            gender: user.gender,
            bloodgroup: user.bloodgroup,
            password_hash: hashedPassword,
            role: user.role,
            isActive: true,
          });

          const savedUser = await manager.save(Users, newUser);

          let savedDoctor: Doctors | null = null;

          if (user.role === UserRole.DOCTOR) {
            const doctor = manager.create(Doctors, {
              specialization: user.specialization!,
              consultationFee: user.consultationFee!,
              experienceYear: user.experienceYear!,
              user: savedUser,
            });

            savedDoctor = await manager.save(Doctors, doctor);
          }

          return {
            user: {
              userid: savedUser.userid,
              fullname: savedUser.fullname,
              email: savedUser.email,
              contact: savedUser.contact,
              role: savedUser.role,
              isActive: savedUser.isActive,
            },
            doctor: savedDoctor
              ? {
                  doctorid: savedDoctor.doctorid,
                  specialization: savedDoctor.specialization,
                  consultationFee: Number(
                    savedDoctor.consultationFee,
                  ),
                  experienceYear: savedDoctor.experienceYear,
                }
              : null,
          };
        },
      );

      return {
        message: 'User Created Successfully',
        data: result,
      };
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      if (
        error instanceof QueryFailedError &&
        (error as any).driverError?.code === '23505'
      ) {
        throw new ConflictException('Email Already Registered');
      }

      console.error('USER CREATION ERROR:', error);
      throw error;
    }
  }

  async getAllUsers(
    page = 1,
    limit = 10,
    role?: UserRole,
  ) {
    if (
      !Number.isInteger(page) ||
      !Number.isInteger(limit) ||
      page < 1 ||
      limit < 1 ||
      limit > 100
    ) {
      throw new BadRequestException(
        'Invalid pagination parameters',
      );
    }

    const skip = (page - 1) * limit;

    const query = this.userRepo
      .createQueryBuilder('user')
      .select([
        'user.userid',
        'user.fullname',
        'user.email',
        'user.contact',
        'user.age',
        'user.gender',
        'user.bloodgroup',
        'user.role',
        'user.isActive',
        'user.created_at',
      ]);

    if (role) {
      if (!Object.values(UserRole).includes(role)) {
        throw new BadRequestException('Invalid user role');
      }

      query.andWhere('user.role = :role', { role });
    }

    const [users, total] = await query
      .orderBy('user.userid', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      message: 'Users Retrieved Successfully',
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserById(id: number): Promise<Users> {
    const user = await this.userRepo.findOne({
      where: { userid: id },
      select: {
        userid: true,
        fullname: true,
        email: true,
        contact: true,
        age: true,
        gender: true,
        bloodgroup: true,
        role: true,
        isActive: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    return user;
  }

  async updateUser(
    id: number,
    updateData: UpdateUserDto,
    requesterId: number,
    requesterRole: UserRole,
  ) {
    const user = await this.userRepo.findOne({
      where: { userid: id },
    });

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    const isAdmin = requesterRole === UserRole.ADMIN;
    const isOwner = requesterId === id;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException(
        'You cannot update this user',
      );
    }

    if (!isAdmin && updateData.isActive !== undefined) {
      throw new ForbiddenException(
        'Only Admin can change account status',
      );
    }

    if (updateData.fullname !== undefined) {
      user.fullname = updateData.fullname;
    }

    if (updateData.contact !== undefined) {
      user.contact = updateData.contact;
    }

    if (isAdmin && updateData.isActive !== undefined) {
      user.isActive = updateData.isActive;
    }

    const updatedUser = await this.userRepo.save(user);

    return {
      message: 'User Updated Successfully',
      data: {
        userid: updatedUser.userid,
        fullname: updatedUser.fullname,
        email: updatedUser.email,
        contact: updatedUser.contact,
        role: updatedUser.role,
        isActive: updatedUser.isActive,
      },
    };
  }

  async deactivateUser(
    id: number,
    requesterRole: UserRole,
  ) {
    if (requesterRole !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'Only Admin can deactivate users',
      );
    }

    const user = await this.userRepo.findOne({
      where: { userid: id },
    });

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    if (!user.isActive) {
      throw new BadRequestException(
        'User is already inactive',
      );
    }

    user.isActive = false;

    await this.userRepo.save(user);

    return {
      message: 'User Deactivated Successfully',
      data: {
        userid: user.userid,
        isActive: user.isActive,
      },
    };
  }
}
