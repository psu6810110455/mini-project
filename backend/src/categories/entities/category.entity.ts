import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SportField } from '../../sport-fields/entities/sport-field.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // ✅ ตรวจสอบให้แน่ใจว่าเรียกใช้ sportField.category (ตามที่เราตั้งไว้ในไฟล์บน)
  @OneToMany(() => SportField, (sportField) => sportField.category)
  sportFields: SportField[]; 
}