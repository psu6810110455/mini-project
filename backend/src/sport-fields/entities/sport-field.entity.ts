import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity()
export class SportField {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({ nullable: true })
  description: string;

  // ✅ เพิ่มบรรทัดนี้ เพื่อให้ Database มีช่องเก็บชื่อไฟล์รูปภาพ
  // nullable: true หมายถึงสนามนี้จะยังไม่มีรูปก็ได้
  @Column({ nullable: true })
  imageUrl: string;

  @ManyToOne(() => Category, (category) => category.sportFields)
  category: Category;

  @OneToMany(() => Booking, (booking) => booking.sportField)
  bookings: Booking[];
}