import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Patients } from '../../patients/entities/patients.entity.js';
import { Slots } from '../../slots/entities/slots.entity.js';

export enum AppointmentStatus {
    BOOKED = 'BOOKED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    NO_SHOW = 'NO_SHOW',
}

@Entity('appointments')
@Index('uq_appointments_active_slot', ['slot'], {
    unique: true,
    where: '"status" = \'BOOKED\'',
})
@Index('idx_appointments_patient_status', ['patient', 'status'])
export class Appointments {
    @PrimaryGeneratedColumn({name: 'appointment_id'})
    appointmentid: number;


    @ManyToOne(() => Patients, { nullable: false, onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'patient_id' })
    patient: Relation<Patients>;

    @ManyToOne(() => Slots, { nullable: false, onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'slot_id' })
    slot: Relation<Slots>;

    @Column({ name: 'appointment_reason', type: 'varchar', length: 500, })
    reason: string;

    @Column({
    name: 'consultation_fee',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  consultationFee: string;

    @Column({
        type: 'enum',
        enum: AppointmentStatus,
        default: AppointmentStatus.BOOKED,
    })
    status: AppointmentStatus;

    @Column({
        name: 'booked_at',
        type: 'timestamp',
        default:() => 'now()',
    })
    bookedAt: Date;

    @Column({ name: 'cancelled_at', type: 'timestamp', nullable: true })
    cancelledAt: Date | null;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp',
    })
    updatedAt: Date;
}
