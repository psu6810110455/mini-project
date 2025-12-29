import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { SportField } from '../../sport-fields/entities/sport-field.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startTime: Date; // เวลาเริ่ม (เช่น 2025-01-01 10:00:00)

  @Column()
  endTime: Date;   // เวลาจบ (เช่น 2025-01-01 12:00:00)

  // 👤 ใครจอง?
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  userId: number;

  // ⚽ จองสนามไหน?
  @ManyToOne(() => SportField, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sport_field_id' })
  sportField: SportField;

  @Column()
  sportFieldId: number;
}