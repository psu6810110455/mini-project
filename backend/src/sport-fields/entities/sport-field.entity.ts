import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';
import { Category } from '../../categories/entities/category.entity'; // ✅ Import มาด้วย

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

  // ✅ เพิ่มส่วนนี้ เพื่อแก้ error TS2339
  @ManyToOne(() => Category, (category) => category.sportFields)
  category: Category;

  @OneToMany(() => Booking, (booking) => booking.sportField)
  bookings: Booking[];
}