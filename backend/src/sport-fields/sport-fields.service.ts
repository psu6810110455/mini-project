import { Injectable } from '@nestjs/common';
import { CreateSportFieldDto } from './dto/create-sport-field.dto';
import { UpdateSportFieldDto } from './dto/update-sport-field.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { SportField } from './entities/sport-field.entity';

@Injectable()
export class SportFieldsService {
  constructor(
    @InjectRepository(SportField)
    private sportFieldsRepository: Repository<SportField>,
  ) {}

  create(createSportFieldDto: CreateSportFieldDto) {
    // บันทึกข้อมูลพร้อมความสัมพันธ์ (categoryId จะถูก map อัตโนมัติ)
    return this.sportFieldsRepository.save(createSportFieldDto);
  }

  // ✅ ฟังก์ชันไฮไลท์: ค้นหา และ กรองหมวดหมู่
  findAll(search?: string, categoryId?: number) {
    const whereCondition: any = {};

    // 1. ถ้ามีการส่งคำค้นหามา (Search Name)
    if (search) {
      whereCondition.name = Like(`%${search}%`); // ค้นหาแบบมีคำนี้อยู่ในชื่อ
    }

    // 2. ถ้ามีการส่งหมวดหมู่มา (Filter Category)
    if (categoryId) {
      whereCondition.categoryId = categoryId;
    }

    return this.sportFieldsRepository.find({
      where: whereCondition,
      relations: ['category'], // ดึงข้อมูลหมวดหมู่มาแสดงด้วย
      order: { name: 'ASC' },  // เรียงตามตัวอักษร
    });
  }

  findOne(id: number) {
    return this.sportFieldsRepository.findOne({
      where: { id },
      relations: ['category'], // ดึงหมวดหมู่มาโชว์ตอนดูรายละเอียด
    });
  }

  update(id: number, updateSportFieldDto: UpdateSportFieldDto) {
    return this.sportFieldsRepository.update(id, updateSportFieldDto);
  }

  remove(id: number) {
    return this.sportFieldsRepository.delete(id);
  }
}