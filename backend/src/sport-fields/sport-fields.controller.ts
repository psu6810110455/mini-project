import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SportFieldsService } from './sport-fields.service';
import { CreateSportFieldDto } from './dto/create-sport-field.dto';
import { UpdateSportFieldDto } from './dto/update-sport-field.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('sport-fields')
export class SportFieldsController {
  constructor(private readonly sportFieldsService: SportFieldsService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSportFieldDto: UpdateSportFieldDto) {
    return this.sportFieldsService.update(+id, updateSportFieldDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sportFieldsService.remove(+id);
  }
}
