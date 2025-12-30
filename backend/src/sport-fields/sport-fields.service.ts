import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SportField } from './entities/sport-field.entity';

@Injectable()
export class SportFieldsService {
  constructor(
    @InjectRepository(SportField)
    private sportFieldRepository: Repository<SportField>,
  ) {}

  // ✅ ฟังก์ชันสำหรับสร้างสนามใหม่
  async create(data: any) {
    const newField = this.sportFieldRepository.create(data);
    return await this.sportFieldRepository.save(newField);
  }

  async findAll() {
    return await this.sportFieldRepository.find();
  }

  async findOne(id: number) {
    const field = await this.sportFieldRepository.findOne({ where: { id } });
    if (!field) throw new NotFoundException('ไม่พบสนามที่ต้องการ');
    return field;
  }

  async update(id: number, data: any) {
    await this.sportFieldRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    return await this.sportFieldRepository.delete(id);
  }
}