import { Controller,Post,Body,Get,ParseIntPipe,Param } from '@nestjs/common';
import { SlotsService } from './slots.service.js';
import { CreateSlotDto } from './dtos/create-slot.dto.js';

@Controller('slots')
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Post('create-slot')
  async createSlot(@Body() slot: CreateSlotDto) {
    return await this.slotsService.createSlot(slot);
  }

  @Get()
  async getAllSlots() {
    return await this.slotsService.getAllSlots();
  }

  @Get(':id')
  async getSlotById(@Param('id', ParseIntPipe) id: number) {
    return await this.slotsService.getSlotById(id);
  }
}
