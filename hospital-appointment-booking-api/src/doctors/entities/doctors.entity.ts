import { Column, Entity, PrimaryGeneratedColumn,CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity('doctors')
export class Doctors{
    @PrimaryGeneratedColumn()
    doctorid:number;

    @Column({
        type:'int',
    })
    userid:number;

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