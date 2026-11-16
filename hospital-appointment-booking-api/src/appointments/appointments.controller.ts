import { Body,Controller,Get,Param,ParseIntPipe,Patch,Post,Req, } from '@nestjs/common';
import type {Request} from 'express';
import { AppointmentsService } from './appointments.service.js';
import { BookAppointmentDto } from './dto/book-appointment.dto.js';
import type { CurrentUser } from '../patients/patients.service.js';
import { Roles } from '../auth/roles/roles.decorator.js';
import { UserRole } from '../users/entities/users.entity.js';

@Controller('appointments')
export class AppointmentsController{
  constructor(private readonly appointmentsService:AppointmentsService){}

  @Post()
  @Roles(UserRole.PATIENT)
  book(@Body() dto: BookAppointmentDto,@Req() req:Request){
    return this.appointmentsService.bookAppointment(
      dto,
      req.user as CurrentUser,
    );
  }

  @Get(':id')
  getAppointment(
    @Param('id',ParseIntPipe) id:number,
    @Req() req:Request,
  ){
    return this.appointmentsService.getAppointmentById(
      id,
      req.user as CurrentUser,
    );
  }

    @Patch(':id/cancel')
  cancel(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.appointmentsService.cancelAppointment(
      id,
        req.user as CurrentUser,
      );
    }

  }

