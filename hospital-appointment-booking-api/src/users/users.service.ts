import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/users.entity.js';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users) 
        private readonly userRepo:Repository<Users>,
    ){}

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
