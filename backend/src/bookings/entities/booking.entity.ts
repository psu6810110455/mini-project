// backend/src/bookings/entities/booking.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
// ✅ ตรวจสอบว่า path ไปหา user.entity ถูกต้อง (ถ้านำไฟล์ไปวางตามโครงสร้างในรูป)
import { User } from '../../users/entities/user.entity'; 
// ✅ ตรวจสอบว่า path ไปหา sport-field.entity ถูกต้อง
import { SportField } from '../../sport-fields/entities/sport-field.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bookingDate: string;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column({ default: 'pending' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  // ✅ แก้ไข: เพิ่ม (user) => user.bookings
  @ManyToOne(() => User, (user) => user.bookings)
  user: User;

  // ✅ แก้ไข: เปลี่ยน (field) => field.id เป็น (field) => field.bookings หรือตัดออกถ้ายังไม่มี relation ฝั่งโน้น
  @ManyToOne(() => SportField, (field) => field.id, { onDelete: 'CASCADE' })
  sportField: SportField;
}