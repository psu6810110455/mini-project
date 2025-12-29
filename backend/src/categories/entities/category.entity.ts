import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SportField } from '../../sport-fields/entities/sport-field.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // ชื่อหมวดหมู่ (เช่น "ฟุตบอล")

  // ความสัมพันธ์: 1 หมวดหมู่ มีหลายสนาม
  @OneToMany(() => SportField, (sportField) => sportField.category)
  sportFields: SportField[];
}