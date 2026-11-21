import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { Appointments, AppointmentStatus } from './entities/appointments.entity.js';
import { BookAppointmentDto } from './dto/book-appointment.dto.js';
import { ListAppointmentsDto, ScheduleQueryDto } from './dto/list-appointments.dto.js';
import { Patients } from '../patients/entities/patients.entity.js';
import { Slots, SlotStatus } from '../slots/entities/slots.entity.js';
import { UserRole } from '../users/entities/users.entity.js';
import type { CurrentUser } from '../patients/patients.service.js';

const MAX_ACTIVE_APPOINTMENTS = 3;
const CANCEL_WINDOW_HOURS = 2;

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointments)
    private readonly appointmentRepo: Repository<Appointments>,
    private readonly dataSource: DataSource,
  ) {}

  private slotStart(slot: Slots): Date {
    return new Date(`${slot.slotDate}T${slot.start_time}`);
  }

  private format(a: Appointments) {
    return {
      id: a.appointmentid,
      patientId: a.patient.patientid,
      slotId: a.slot.slotid,
      reason: a.reason,
      consultationFee: a.consultationFee,
      status: a.status,
      bookedAt: a.bookedAt,
      cancelledAt: a.cancelledAt,
    };
  }

  async bookAppointment(dto: BookAppointmentDto, current: CurrentUser) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const patient = await manager.findOne(Patients, {
          where: { user: { userid: current.id } },
        });
        if (!patient) {
          throw new NotFoundException('Patient profile not found');
        }

        const slot = await manager.findOne(Slots, {
          where: { slotid: dto.slotId },
          relations: { doctor: true },
          relationLoadStrategy: 'query',
          lock: { mode: 'pessimistic_write' },
        });
        if (!slot) {
          throw new NotFoundException('Slot not found');
        }
        if (slot.status !== SlotStatus.AVAILABLE) {
          throw new ConflictException('Slot is no longer available');
        }
        if (this.slotStart(slot) <= new Date()) {
          throw new ConflictException('Slot has already started');
        }

        const active = await manager.find(Appointments, {
          where: {
            patient: { patientid: patient.patientid },
            status: AppointmentStatus.BOOKED,
          },
          relations: { slot: true },
        });
        if (active.length >= MAX_ACTIVE_APPOINTMENTS) {
          throw new ConflictException(
            `You already have ${MAX_ACTIVE_APPOINTMENTS} active appointments`,
          );
        }
        const clash = active.some(
          (a) =>
            a.slot.slotDate === slot.slotDate &&
            slot.start_time < a.slot.end_time &&
            slot.end_time > a.slot.start_time,
        );
        if (clash) {
          throw new ConflictException(
            'You already have an appointment at this date and time',
          );
        }

        slot.status = SlotStatus.BOOKED;
        await manager.save(slot);

        const appointment = await manager.save(
          manager.create(Appointments, {
            patient,
            slot,
            reason: dto.reason,
            consultationFee: Number(slot.doctor.consultationFee).toFixed(2),
            status: AppointmentStatus.BOOKED,
          }),
        );
        return this.format(appointment);
      });
    } catch (err: any) {
      const code = err?.driverError?.code ?? err?.code;
      if (code === '23505') {
        throw new ConflictException('Slot is no longer available');
      }
      throw err;
    }
  }

  async cancelAppointment(id: number, current: CurrentUser) {
    return await this.dataSource.transaction(async (manager) => {
      const appointment = await manager.findOne(Appointments, {
        where: { appointmentid: id },
        relations: { patient: { user: true }, slot: { doctor: { user: true } } },
        relationLoadStrategy: 'query',
        lock: { mode: 'pessimistic_write' },
      });
      if (!appointment) {
        throw new NotFoundException('Appointment not found');
      }

      const isAdmin = current.role === UserRole.ADMIN;
      const isOwner = appointment.patient.user.userid === current.id;
      const isDoctor = appointment.slot.doctor.user.userid === current.id;
      if (!isAdmin && !isOwner && !isDoctor) {
        throw new ForbiddenException('You cannot cancel this appointment');
      }
      if (appointment.status !== AppointmentStatus.BOOKED) {
        throw new ConflictException('Only BOOKED appointments can be cancelled');
      }
      if (current.role === UserRole.PATIENT) {
        const hoursLeft =
          (this.slotStart(appointment.slot).getTime() - Date.now()) / 3600000;
        if (hoursLeft < CANCEL_WINDOW_HOURS) {
          throw new ConflictException(
            `Patients can cancel only ${CANCEL_WINDOW_HOURS} hours or more before the appointment`,
          );
        }
      }

      appointment.status = AppointmentStatus.CANCELLED;
      appointment.cancelledAt = new Date();
      appointment.slot.status = SlotStatus.AVAILABLE;
      await manager.save(appointment.slot);
      await manager.save(appointment);
      return this.format(appointment);
    });
  }

  async getMyAppointments(userId: number) {
    const list = await this.appointmentRepo.find({
      where: { patient: { user: { userid: userId } } },
      relations: { patient: true, slot: true },
      order: { bookedAt: 'DESC' },
    });
    return list.map((a) => this.format(a));
  }

  async getAppointmentById(id: number, current: CurrentUser) {
    const appointment = await this.appointmentRepo.findOne({
      where: { appointmentid: id },
      relations: { patient: { user: true }, slot: { doctor: { user: true } } },
    });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    const isAdmin = current.role === UserRole.ADMIN;
    const isOwner = appointment.patient.user.userid === current.id;
    const isDoctor = appointment.slot.doctor.user.userid === current.id;
    if (!isAdmin && !isOwner && !isDoctor) {
      throw new ForbiddenException('You cannot view this appointment');
    }
    return this.format(appointment);
  }

  async listAll(q: ListAppointmentsDto) {
    const page = q.page ?? 1;
    const limit = q.limit ?? 10;

    const where: FindOptionsWhere<Appointments> = {};
    if (q.status) where.status = q.status;
    if (q.patientId) where.patient = { patientid: q.patientId };

    const slot: FindOptionsWhere<Slots> = {};
    if (q.doctorId) slot.doctor = { doctorid: q.doctorId };
    if (q.date) slot.slotDate = q.date;
    if (Object.keys(slot).length > 0) where.slot = slot;

    const [items, total] = await this.appointmentRepo.findAndCount({
      where,
      relations: { patient: true, slot: true },
      order: { bookedAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items: items.map((a) => this.format(a)), total, page, limit };
  }

  async getSchedule(userId: number, q: ScheduleQueryDto) {
    const slot: FindOptionsWhere<Slots> = {
      doctor: { user: { userid: userId } },
    };
    if (q.date) slot.slotDate = q.date;

    const where: FindOptionsWhere<Appointments> = { slot };
    if (q.status) where.status = q.status;

    const list = await this.appointmentRepo.find({
      where,
      relations: { patient: true, slot: true },
      order: { slot: { slotDate: 'ASC', start_time: 'ASC' } },
    });
    return list.map((a) => this.format(a));
  }

  async markNoShow(id: number, current: CurrentUser) {
    return await this.dataSource.transaction(async (manager) => {
      const appointment = await manager.findOne(Appointments, {
        where: { appointmentid: id },
        relations: { patient: true, slot: { doctor: { user: true } } },
        relationLoadStrategy: 'query',
        lock: { mode: 'pessimistic_write' },
      });
      if (!appointment) {
        throw new NotFoundException('Appointment not found');
      }
      if (appointment.slot.doctor.user.userid !== current.id) {
        throw new ForbiddenException('This is not your appointment');
      }
      if (appointment.status !== AppointmentStatus.BOOKED) {
        throw new ConflictException('Only BOOKED appointments can be marked NO_SHOW');
      }
      if (this.slotStart(appointment.slot) > new Date()) {
        throw new ConflictException('Slot has not started yet');
      }
      appointment.status = AppointmentStatus.NO_SHOW;
      await manager.save(appointment);
      return this.format(appointment);
    });
  }
}