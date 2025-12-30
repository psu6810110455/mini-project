// backend/src/users/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: 'user' }) // 'user' หรือ 'admin'
  role: string;

  // ความสัมพันธ์ที่เพิ่มเข้าไปใหม่
  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];
}