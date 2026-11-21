import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { AppointmentsService } from './appointments.service.js';
import { BookAppointmentDto } from './dto/book-appointment.dto.js';
import { ListAppointmentsDto, ScheduleQueryDto } from './dto/list-appointments.dto.js';
import type { CurrentUser } from '../patients/patients.service.js';
import { Roles } from '../auth/roles/roles.decorator.js';
import { UserRole } from '../users/entities/users.entity.js';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @Roles(UserRole.PATIENT)
  book(@Body() dto: BookAppointmentDto, @Req() req: Request) {
    return this.appointmentsService.bookAppointment(dto, req.user as CurrentUser);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  list(@Query() q: ListAppointmentsDto) {
    return this.appointmentsService.listAll(q);
  }

  @Get('my')
  @Roles(UserRole.PATIENT)
  my(@Req() req: Request) {
    return this.appointmentsService.getMyAppointments((req.user as CurrentUser).id);
  }

  @Get('schedule')
  @Roles(UserRole.DOCTOR)
  schedule(@Query() q: ScheduleQueryDto, @Req() req: Request) {
    return this.appointmentsService.getSchedule((req.user as CurrentUser).id, q);
  }

  @Get(':id')
  getAppointment(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.appointmentsService.getAppointmentById(id, req.user as CurrentUser);
  }

  @Patch(':id/cancel')
  cancel(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.appointmentsService.cancelAppointment(id, req.user as CurrentUser);
  }

  @Patch(':id/no-show')
  @Roles(UserRole.DOCTOR)
  noShow(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.appointmentsService.markNoShow(id, req.user as CurrentUser);
  }
}