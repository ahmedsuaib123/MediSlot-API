import { Body,
        Controller,
        Get,
        Param,
        ParseIntPipe,
        Patch,
        Req, } from '@nestjs/common';

        import type { Request } from 'express';
        import { PatientsService } from './patients.service.js';
        import type { CurrentUser } from './patients.service.js';
        import { UpdatePatientDto } from './dtos/update-patient.dto.js';
        import { Roles } from '../auth/roles/roles.decorator.js';
        import { UserRole } from '../users/entities/users.entity.js';


@Controller('patients')
export class PatientsController {
    constructor(private readonly patientsService: PatientsService) {}

    @Get('me')
    @Roles(UserRole.PATIENT)
    getMyProfile(@Req() req: Request) {
        const user = req.user as CurrentUser;
        return this.patientsService.getMyProfile(user.id);
    }

    @Get(':id')
    getpatient(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
        return this.patientsService.getPatientById(id, req.user as CurrentUser);
    }

    @Patch(':id')
    updatePatient(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdatePatientDto,
        @Req() req: Request,
    ) {
        return this.patientsService.updatePatient(id, dto, req.user as CurrentUser);
    }
}
