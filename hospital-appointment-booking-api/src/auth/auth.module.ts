import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import {ConfigService} from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { JwtStrategy } from './jwtStrategy.strategy.js';
import {JwtGuard} from './jwtGuard.guard.js';
import { RolesGuard } from './roles/roles.guard.js';
import { Users } from '../users/entities/users.entity.js';
import { Patients } from '../patients/entities/patients.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Patients]),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: Number(config.get('JWT_EXPIRES_IN') ?? 3600),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    { provide: APP_GUARD, useClass: JwtGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AuthModule {}