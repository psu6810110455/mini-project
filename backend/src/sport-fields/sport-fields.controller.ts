// backend/src/sport-fields/sport-fields.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SportFieldsService } from './sport-fields.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('sport-fields')
export class SportFieldsController {
  constructor(private readonly sportFieldsService: SportFieldsService) {}

  // ✅ เพิ่มฟังก์ชันนี้เข้าไป (ที่เดิมคุณทำหายไป)
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createFieldDto: any) {
    return this.sportFieldsService.create(createFieldDto);
  }

  @Get()
  findAll() {
    return this.sportFieldsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sportFieldsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    // ✅ แก้ไขเส้นหยัก: ตรวจสอบให้แน่ใจว่าใน Service มีฟังก์ชัน update รับ (number, any)
    return this.sportFieldsService.update(+id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    // ✅ แก้ไขเส้นหยัก: ตรวจสอบให้แน่ใจว่าใน Service มีฟังก์ชัน remove รับ (number)
    return this.sportFieldsService.remove(+id);
  }
}