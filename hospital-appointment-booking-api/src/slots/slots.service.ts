import { Injectable, BadRequestException, NotFoundException,ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Slots, SlotStatus } from './entities/slots.entity.js';
import { DoctorsService } from '../doctors/doctors.service.js';
import { CreateSlotDto } from './dtos/create-slot.dto.js';
import { Doctors } from '../doctors/entities/doctors.entity.js';
import { UpdateSlotDto } from './dtos/update-slot.dto.js';

@Injectable()
export class SlotsService {
    constructor(
        @InjectRepository(Slots)
        private readonly slotRepo: Repository<Slots>,
        private readonly doctorsService: DoctorsService,
    ) {}

    async createSlot(slot: CreateSlotDto) {
        try {
            const doctor = await this.doctorsService.getDoctorById(slot.doctorId);

            if (doctor == null || typeof doctor === 'string') {
                throw new NotFoundException('Doctor Not Found');
            }

            // Check valid time range
            if (slot.start_time >= slot.end_time) {
                throw new BadRequestException('End time must be after start time');
            }

            const existingSlots = await this.slotRepo.find({
                where: {
                    doctor: { 
                        doctorid: slot.doctorId 
                    },
                    slotDate: slot.slotDate,
                },
            });

            const overlappingSlot = existingSlots.some((existingSlot) =>slot.start_time < existingSlot.end_time && slot.end_time > existingSlot.start_time);

            if (overlappingSlot) {
                throw new BadRequestException('Doctor already has a slot at this time',);
            }

            const slotObj = this.slotRepo.create({
                slotDate: slot.slotDate,
                start_time: slot.start_time,
                end_time: slot.end_time,
                status: SlotStatus.AVAILABLE,
                doctor: { 
                    doctorid: slot.doctorId 
                } as Doctors,
            });

            //return await this.slotRepo.save(slotObj);
            // Save slot
            const savedSlot = await this.slotRepo.save(slotObj);


            const createdSlot = await this.slotRepo.findOne({
                where: {
                    slotid: savedSlot.slotid,
                },
                relations: {
                    doctor: {
                        user: true,
                    },
                },
            });

            if (createdSlot) {
                return {
                    slotid: createdSlot.slotid,
                    doctorid: createdSlot.doctor.doctorid,
                    doctorname: createdSlot.doctor.user.fullname,
                    slotDate: createdSlot.slotDate,
                    start_time: createdSlot.start_time,
                    end_time: createdSlot.end_time,
                    status: createdSlot.status,
                };
            }

            throw new BadRequestException(
                'Slot Created but details could not be retrieved',
            );

        } catch (error) {
            if (error instanceof NotFoundException ||error instanceof BadRequestException) {
                throw error;
            }

            throw new BadRequestException('Slot Creation Failed');
        }
    }

    async getAllSlots() {
        try {
            const slots = await this.slotRepo.find({
                relations: {
                    doctor: {
                        user: true,
                    },
                },
                select: {
                    slotid: true,
                    slotDate: true,
                    start_time: true,
                    end_time: true,
                    status: true,
                    doctor: {
                        doctorid: true,
                        user: {
                            fullname: true,
                        },
                    },
                },
            });

            if (slots.length > 0) {
                return slots.map((slot) => ({
                    slotid: slot.slotid,
                    doctorid: slot.doctor.doctorid,
                    doctorname: slot.doctor.user.fullname,
                    slotDate: slot.slotDate,
                    start_time: slot.start_time,
                    end_time: slot.end_time,
                    status: slot.status,
                }));
            } else {
                return 'No Slots Found';
            }

        } catch (error) {
            throw new BadRequestException('Failed to Retrieve Slots');
        }
    }

    async getSlotById(id: number) {
        try {
            const slot = await this.slotRepo.findOne({
                where: {
                    slotid: id,
                },
                relations: {
                    doctor: {
                        user: true,
                    },
                },
                select: {
                    slotid: true,
                    slotDate: true,
                    start_time: true,
                    end_time: true,
                    status: true,
                    doctor: {
                        doctorid: true,
                        user: {
                            fullname: true,
                        },
                    },
                },
            });

            if (slot) {
                return {
                    slotid: slot.slotid,
                    doctorid: slot.doctor.doctorid,
                    doctorname: slot.doctor.user.fullname,
                    slotDate: slot.slotDate,
                    start_time: slot.start_time,
                    end_time: slot.end_time,
                    status: slot.status,
                };
            } else {
                return 'Slot Not Found';
            }

        } catch (error) {
            throw new BadRequestException('Failed to Retrieve Slot');
        }
    }

    async getSlotsByDoctorId(doctorId: number) {
        try {
            const slots = await this.slotRepo.find({
                where: {
                    doctor: {
                        doctorid: doctorId,
                    },
                },
                relations: {
                    doctor: {
                        user: true,
                    },
                },
                select: {
                    slotid: true,
                    slotDate: true,
                    start_time: true,
                    end_time: true,
                    status: true,
                    doctor: {
                        doctorid: true,
                        user: {
                            fullname: true,
                        },
                    },
                },
            });

            if (slots.length > 0) {
                return slots.map((slot) => ({
                    slotid: slot.slotid,
                    doctorid: slot.doctor.doctorid,
                    doctorname: slot.doctor.user.fullname,
                    slotDate: slot.slotDate,
                    start_time: slot.start_time,
                    end_time: slot.end_time,
                    status: slot.status,
                }));
            } else {
                return 'No Slots Found For This Doctor';
            }

        } catch (error) {
            throw new BadRequestException('Failed to Retrieve Doctor Slots');
        }
    }

    async getAvailableSlotsByDoctorId(doctorId: number) {
        try {
            const slots = await this.slotRepo.find({
                where: {
                    doctor: {
                        doctorid: doctorId,
                    },
                    status: SlotStatus.AVAILABLE,
                },
                relations: {
                    doctor: {
                        user: true,
                    },
                },
                select: {
                    slotid: true,
                    slotDate: true,
                    start_time: true,
                    end_time: true,
                    status: true,
                    doctor: {
                        doctorid: true,
                        user: {
                            fullname: true,
                        },
                    },
                },
            });

            if (slots.length > 0) {
                return slots.map((slot) => ({
                    slotid: slot.slotid,
                    doctorid: slot.doctor.doctorid,
                    doctorname: slot.doctor.user.fullname,
                    slotDate: slot.slotDate,
                    start_time: slot.start_time,
                    end_time: slot.end_time,
                    status: slot.status,
                }));
            } else {
                return 'No Available Slots Found for this Doctor';
            }

        } catch (error) {
            throw new BadRequestException('Failed to Retrieve Available Slots');
        }
    }

    async getBookedSlotsByDoctorId(doctorId: number) {
        try {
            const slots = await this.slotRepo.find({
                where: {
                    doctor: {
                        doctorid: doctorId,
                    },
                    status: SlotStatus.BOOKED,
                },
                relations: {
                    doctor: {
                        user: true,
                    },
                },
                select: {
                    slotid: true,
                    slotDate: true,
                    start_time: true,
                    end_time: true,
                    status: true,
                    doctor: {
                        doctorid: true,
                        user: {
                            fullname: true,
                        },
                    },
                },
            });

            if (slots.length > 0) {
                return slots.map((slot) => ({
                    slotid: slot.slotid,
                    doctorid: slot.doctor.doctorid,
                    doctorname: slot.doctor.user.fullname,
                    slotDate: slot.slotDate,
                    start_time: slot.start_time,
                    end_time: slot.end_time,
                    status: slot.status,
                }));
            } else {
                return 'No Booked Slots Found for this Doctor';
            }

        } catch (error) {
            throw new BadRequestException('Failed to Retrieve Booked Slots');
        }
    }

    async getAllAvailableSlots() {
        try {
            const slots = await this.slotRepo.find({
                where: {
                    status: SlotStatus.AVAILABLE,
                },
                relations: {
                    doctor: {
                        user: true,
                    },
                },
            });

            if (slots.length > 0) {
                return slots.map((slot) => ({
                    slotid: slot.slotid,
                    doctorid: slot.doctor.doctorid,
                    doctorname: slot.doctor.user.fullname,
                    slotDate: slot.slotDate,
                    start_time: slot.start_time,
                    end_time: slot.end_time,
                    status: slot.status,
                }));
            } else {
                return 'No Available Slots Found';
            }

        } catch (error) {
            throw new BadRequestException('Failed to Retrieve Available Slots');
        }
    }

    async getAllBookedSlots() {
        try {
            const slots = await this.slotRepo.find({
                where: {
                    status: SlotStatus.BOOKED,
                },
                relations: {
                    doctor: {
                        user: true,
                    },
                },
            });

            if (slots.length > 0) {
                return slots.map((slot) => ({
                    slotid: slot.slotid,
                    doctorid: slot.doctor.doctorid,
                    doctorname: slot.doctor.user.fullname,
                    slotDate: slot.slotDate,
                    start_time: slot.start_time,
                    end_time: slot.end_time,
                    status: slot.status,
                }));
            } else {
                return 'No Booked Slots Found';
            }

        } catch (error) {
            throw new BadRequestException('Failed to Retrieve Booked Slots');
        }
    }


    async deleteSlot(id: number): Promise<string> {
        try {
            const slot = await this.slotRepo.findOne({
                where: {
                    slotid: id,
                },
            });

            if (!slot) {
                throw new NotFoundException('Slot Not Found');
            }

            if (slot.status !== SlotStatus.AVAILABLE) {
                throw new BadRequestException(
                    'Booked Slot Cannot Be Deleted',
                );
            }

            await this.slotRepo.remove(slot);

            return 'Slot Deleted Successfully';

        } catch (error) {
            if (
                error instanceof NotFoundException ||
                error instanceof BadRequestException
            ) {
                throw error;
            }

            throw new BadRequestException('Slot Deletion Failed');
        }
    }


    async updateSlot(id: number, slot: UpdateSlotDto) {
        try {
            const existingSlot = await this.slotRepo.findOne({
                where: {
                    slotid: id,
                },
            });

            if (!existingSlot) {
                throw new NotFoundException('Slot Not Found');
            }

            if (existingSlot.status !== SlotStatus.AVAILABLE) {
                throw new BadRequestException(
                    'Booked Slot Cannot Be Updated',
                );
            }

            const newDate = slot.slotDate ?? existingSlot.slotDate;
            const newStartTime = slot.start_time ?? existingSlot.start_time;
            const newEndTime = slot.end_time ?? existingSlot.end_time;

            if (newStartTime >= newEndTime) {
                throw new BadRequestException(
                    'End time must be after start time',
                );
            }

            const existingSlots = await this.slotRepo.find({
                where: {
                    doctor: {
                        doctorid: existingSlot.doctor.doctorid,
                    },
                    slotDate: newDate,
                },
                relations: {
                    doctor: true,
                },
            });

            const overlappingSlot = existingSlots.some(
                (existing) =>
                    existing.slotid !== id &&
                    newStartTime < existing.end_time &&
                    newEndTime > existing.start_time,
            );

            if (overlappingSlot) {
                throw new ConflictException(
                    'Doctor Already Has a Slot at This Time',
                );
            }

            existingSlot.slotDate = newDate;
            existingSlot.start_time = newStartTime;
            existingSlot.end_time = newEndTime;

            return await this.slotRepo.save(existingSlot);

        } catch (error) {
            if (
                error instanceof NotFoundException ||
                error instanceof BadRequestException ||
                error instanceof ConflictException
            ) {
                throw error;
            }

            throw new BadRequestException('Slot Update Failed');
        }
    }


}
