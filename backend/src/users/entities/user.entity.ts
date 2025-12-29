import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  // ❌ ของเดิมที่ Error: @Column({ type: 'enum', enum: ... })
  // ✅ แก้เป็นแบบนี้ครับ (ลบ type: 'enum' ออก)
  @Column({ default: 'user' }) 
  role: string; 

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}