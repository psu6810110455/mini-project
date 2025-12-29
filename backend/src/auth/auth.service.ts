import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // 1. ตรวจสอบ Username/Password (ใช้ตอน Login)
  async validateUser(username: string, pass: string): Promise<any> {
    // ⚠️ จุดที่แก้ไข: เปลี่ยนจาก findOne เป็น findByUsername
    const user = await this.usersService.findByUsername(username);
    
    // เช็คว่ามี User ไหม และรหัสผ่านตรงกันไหม
    if (user && (await bcrypt.compare(pass, user.password))) {
      // ถ้าตรงกัน ให้ตัด field password ทิ้งก่อนส่งข้อมูลกลับเพื่อความปลอดภัย
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // 2. สร้าง Token (Login)
  async login(user: any) {
    // ข้อมูลที่จะฝังไว้ใน Token (Payload)
    const payload = { username: user.username, sub: user.id, role: user.role };
    
    return {
      access_token: this.jwtService.sign(payload), // สร้าง String ยาวๆ ส่งกลับไป
    };
  }

  // 3. ลงทะเบียน (Register)
  async register(userDto: any) {
    // ส่งต่อให้ UsersService เป็นคนสร้าง (เพราะ logic การ hash password อยู่ที่นั่น)
    return this.usersService.create(userDto);
  }
}