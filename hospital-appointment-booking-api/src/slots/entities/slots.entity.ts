import { Entity, PrimaryGeneratedColumn,Column,ManyToOne,JoinColumn,CreateDateColumn,UpdateDateColumn } from "typeorm";
import type {Relation} from 'typeorm';
import { Doctors } from '../../doctors/entities/doctors.entity.js';

export enum SlotStatus{
    AVAILABLE='AVAILABLE',
    BOOKED='BOOKED',
}
@Entity('slots')
export class Slots{
    @PrimaryGeneratedColumn()
    slotid:number;
    @Column({
        type: 'date' 
    })
    slotDate: string;

    @Column({ 
        type: 'time' 
    })
    start_time: string;

    @Column({ 
        type: 'time' 
    })
    end_time: string;

    @Column({
        type: 'enum',
        enum: SlotStatus,
        default: SlotStatus.AVAILABLE,
    })
    status: SlotStatus;

    @ManyToOne(() => Doctors)
    @JoinColumn({ 
        name: 'doctorid' 
    })
    doctor: Relation<Doctors>;

    @CreateDateColumn({ 
        name: 'created_at', 
        type: 'timestamp' 
    })
    created_at: Date;

    @UpdateDateColumn({ 
        name: 'updated_at', 
        type: 'timestamp' 
    })
    updated_at: Date;
}