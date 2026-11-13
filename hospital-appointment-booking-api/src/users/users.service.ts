import { ConflictException, Injectable,BadRequestException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users,UserRole } from './entities/users.entity.js';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto.js';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users) 
        private readonly userRepo:Repository<Users>,
    ){}

    async createUser(user:CreateUserDto): Promise<string>{
        try{
            const existingUser=await this.userRepo.findOne(
                {
                    where:{
                        email:user.email
                    },
                }
            );

            if(existingUser){
                throw new ConflictException('Email Already Registered');
            }

            const hashedPassword=await bcrypt.hash(user.password,10);

            const u=this.userRepo.create(
                {
                    fullname:user.fullname,
                    email:user.email,
                    contact:user.contact,
                    age:user.age,
                    gender:user.gender,
                    bloodgroup:user.bloodgroup,
                    password_hash:hashedPassword,
                    role:UserRole.PATIENT,
                }
            );

            const savedUser= await this.userRepo.save(u);

            if(savedUser!=null){
                return 'User Created Successfully';
            } else{
                return 'User Creation Failed';
            }
        } catch(error){
            if(error instanceof ConflictException){
                throw error;
            }

            throw new BadRequestException('Database Error');
        }
    }

    async getUserById(id:number): Promise<Users| string>{
        const user=await this.userRepo.findOne(
            {
                where: {
                    userid:id
                },
            }
        );

        if(user){
            return user;
        } else{
            return 'Not Found';
        }
    }
}
