import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SportFieldsService } from './sport-fields.service';
import { CreateSportFieldDto } from './dto/create-sport-field.dto';
import { UpdateSportFieldDto } from './dto/update-sport-field.dto';

@Controller('sport-fields')
export class SportFieldsController {
  constructor(private readonly sportFieldsService: SportFieldsService) {}

  @Post()
  create(@Body() createSportFieldDto: CreateSportFieldDto) {
    return this.sportFieldsService.create(createSportFieldDto);
  }

  // ✅ แก้ตรงนี้: ให้รับ Query Params (เช่น ?search=บอล&categoryId=1)
  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    // แปลง categoryId จาก string เป็น number ก่อนส่งไป
    const catId = categoryId ? +categoryId : undefined;
    return this.sportFieldsService.findAll(search, catId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sportFieldsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSportFieldDto: UpdateSportFieldDto) {
    return this.sportFieldsService.update(+id, updateSportFieldDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sportFieldsService.remove(+id);
  }
}