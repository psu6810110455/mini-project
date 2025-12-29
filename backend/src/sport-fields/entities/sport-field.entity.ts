import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

@Entity()
export class SportField {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // ชื่อสนาม

  @Column()
  description: string; // รายละเอียด

  // ❌ ลบ price_per_hour ออกแล้วครับ

  @ManyToOne(() => Category, (category) => category.sportFields, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column()
  categoryId: number;
}