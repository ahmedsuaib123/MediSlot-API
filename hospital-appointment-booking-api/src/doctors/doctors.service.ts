import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctors } from './entities/doctors.entity.js';
import { Repository } from 'typeorm';

@Injectable()
export class DoctorsService {
    constructor(
        @InjectRepository(Doctors)
        private readonly doctorsRepo: Repository<Doctors>,
    ){}
}
