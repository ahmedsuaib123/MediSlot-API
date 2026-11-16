import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module.js';
import { DoctorsModule } from './doctors/doctors.module.js';
import { UsersModule } from './users/users.module.js'
import { PatientsModule } from './patients/patients.module.js';
import { AppointmentsModule } from './appointments/appointments.module.js';

import { SlotsModule } from './slots/slots.module.js';


@Module({
  imports: [
    ConfigModule.forRoot(
      {
        isGlobal:true,
      }
    ),

    TypeOrmModule.forRoot(
      {
        type:'postgres',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        autoLoadEntities: true,
        synchronize: true,
      }
    ),

    AuthModule,

    DoctorsModule,

    UsersModule,


    PatientsModule,

    AppointmentsModule,
    SlotsModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
