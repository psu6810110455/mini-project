import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    // ⚠️ เช็คตรงนี้: ต้องเป็น Repository<User> (ห้ามมี [] ต่อท้าย User)
    private usersRepository: Repository<User>,
  ) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  // --- ส่วนแก้ Error ตรงนี้ ---
  async create(createUserDto: any): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    // ✅ แก้ไข: ระบุ type : User ชัดเจน และไม่ใช้ ... spread operator กับ any
    const user: User = this.usersRepository.create({
      username: createUserDto.username,
      password: hashedPassword,
      role: createUserDto.role || 'user', // กันเหนียวเผื่อไม่มี role ส่งมา
    });

    return this.usersRepository.save(user);
  }
  // --------------------------

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: any) {
    return this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    return this.usersRepository.delete(id);
  }
}