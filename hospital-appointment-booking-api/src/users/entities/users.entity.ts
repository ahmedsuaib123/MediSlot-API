import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  PATIENT = 'PATIENT',
}

export enum BloodGroup {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
}

export enum Gender{
  MALE='male',
  FEMALE='female',
  OTHERS='others',
}

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn()
  userid: number;

  @Column({
    type: 'varchar',
    length: 150,
  })
  fullname: string;

  @Column({
    type: 'varchar',
    length: 150,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 20,
  })
  contact: string;

  @Column({
    type: 'int',
  })
  age: number;

  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender: string;

  @Column({
    type: 'enum',
    enum: BloodGroup,
  })
  bloodgroup: BloodGroup;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @Column({
    type: 'varchar',
    length: 255,
  })
  password_hash: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  created_at: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updated_at: Date;
}
