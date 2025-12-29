import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
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

  @Get()
  findAll() {
    return this.sportFieldsService.findAll();
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
