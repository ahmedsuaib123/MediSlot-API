import{
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { BloodGroup, Users } from '../../users/entities/users.entity.js';

@Entity('patients')
export class Patients {
    @PrimaryGeneratedColumn()
    patientid: number;

    @OneToOne(() => Users, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userid' })
    user: Relation<Users>;

    @Column({ type: 'enum', enum: BloodGroup,

     })
    bloodGroup: BloodGroup;

    @Column({ type: 'varchar', length: 1000, })
    address: string;

    @Column({ type: 'varchar', length: 20, })
    emergencyContact: string;

    @CreateDateColumn ({
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