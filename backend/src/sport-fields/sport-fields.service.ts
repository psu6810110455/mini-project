import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSportFieldDto } from './dto/create-sport-field.dto';
import { UpdateSportFieldDto } from './dto/update-sport-field.dto';
import { SportField } from './entities/sport-field.entity';

@Injectable()
export class SportFieldsService {
  constructor(
    @InjectRepository(SportField)
    private sportFieldsRepository: Repository<SportField>,
  ) { }

  async create(createSportFieldDto: CreateSportFieldDto) {
    const sportField = this.sportFieldsRepository.create(createSportFieldDto);
    return this.sportFieldsRepository.save(sportField);
  }

  async findAll() {
    return this.sportFieldsRepository.find();
  }

  async findOne(id: number) {
    const field = await this.sportFieldsRepository.findOneBy({ id });
    if (!field) {
      throw new NotFoundException(`Sport Field #${id} not found`);
    }
    return field;
  }

  async update(id: number, updateSportFieldDto: UpdateSportFieldDto) {
    const field = await this.findOne(id);
    Object.assign(field, updateSportFieldDto);
    return this.sportFieldsRepository.save(field);
  }

  async remove(id: number) {
    const field = await this.findOne(id);
    return this.sportFieldsRepository.remove(field);
  }
}
