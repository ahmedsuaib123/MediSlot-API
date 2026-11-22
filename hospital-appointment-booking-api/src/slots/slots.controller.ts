import { Controller,Post,Body,Get,ParseIntPipe,Param, Patch,Delete } from '@nestjs/common';
import { SlotsService } from './slots.service.js';
import { CreateSlotDto } from './dtos/create-slot.dto.js';
import { UpdateSlotDto } from './dtos/update-slot.dto.js';
import { Public } from '../auth/public.decorator.js';
import { Roles } from '../auth/roles/roles.decorator.js';
import { UserRole } from '../users/entities/users.entity.js';




@Controller('slots')
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Public()
  @Post('create-slot')
  async createSlot(@Body() slot: CreateSlotDto) {
    return await this.slotsService.createSlot(slot);
  }
@Public()
  @Get()
  async getAllSlots() {
    return await this.slotsService.getAllSlots();
  }
@Public()
  @Get('booked')
  async getAllBookedSlots() {
    return await this.slotsService.getAllBookedSlots();
  }
@Public()
  @Get('available')
  async getAllAvailableSlots() {
    return await this.slotsService.getAllAvailableSlots();
  }
@Roles(UserRole.ADMIN)
  @Get(':id')
  async getSlotById(@Param('id', ParseIntPipe) id: number) {
    return await this.slotsService.getSlotById(id);
  }
@Roles(UserRole.ADMIN)
  @Get('doctor/:doctorId')
  async getSlotsByDoctorId(@Param('doctorId', ParseIntPipe) doctorId: number) {
    return await this.slotsService.getSlotsByDoctorId(doctorId);
  }
@Public()
  @Get('doctor/:doctorId/available')
  async getAvailableSlotsByDoctorId(@Param('doctorId', ParseIntPipe) doctorId: number) {
    return await this.slotsService.getAvailableSlotsByDoctorId(doctorId);
  }
@Public()
  @Get('doctor/:doctorId/booked')
  async getBookedSlotsByDoctorId(@Param('doctorId', ParseIntPipe) doctorId: number){
    return await this.slotsService.getBookedSlotsByDoctorId(doctorId);
  }
@Roles(UserRole.ADMIN,UserRole.DOCTOR)
  @Patch(':id')
  async updateSlot(@Param('id', ParseIntPipe) id: number,@Body() slot: UpdateSlotDto) {
      return await this.slotsService.updateSlot(id, slot);
  }
@Roles(UserRole.ADMIN,UserRole.DOCTOR)
  @Delete(':id')
  async deleteSlot(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return await this.slotsService.deleteSlot(id);
  }
}
