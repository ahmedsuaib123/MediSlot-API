import { Column, Entity, PrimaryGeneratedColumn,CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from "typeorm"
import { Users } from "../../users/entities/users.entity.js";
import type { Relation } from "typeorm";

@Entity('doctors')
export class Doctors{
    @PrimaryGeneratedColumn()
    doctorid:number;

    @OneToOne(()=>Users)
    @JoinColumn({
        name:'userid'
    })
    user:Relation<Users>;

    @Column({
        type:'varchar',
        length:50,
    })
    specialization:string;

    @Column({
        type:'decimal',
    })
    consultationFee:number;

     @Column({
        type:'int',
    })
    experienceYear:number;

    @CreateDateColumn({
        name:'created_at',
        type:'timestamp',
    })
    created_at:Date;

    @UpdateDateColumn({
        name:'updated_at',
        type:'timestamp',
    })
    updated_at:Date;

}