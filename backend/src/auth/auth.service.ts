import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service'; // 👈 Path นี้จะถูกต้องเมื่ออยู่ในไฟล์นี้
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    console.log('--- LOGIN DEBUG START ---');
    console.log('1. Input Username:', username);
    console.log('2. Input Password:', pass);

    const user = await this.usersService.findOneByUsername(username);
    
    console.log('3. Found User in DB:', user);

    if (!user) {
        console.log('❌ Error: User Not Found');
        throw new UnauthorizedException();
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    
    console.log('4. Password Match Status:', isMatch);

    if (!isMatch) {
      console.log('❌ Error: Password mismatch');
      throw new UnauthorizedException();
    }

    console.log('✅ Login Success!');
    const payload = { sub: user.id, username: user.username, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}