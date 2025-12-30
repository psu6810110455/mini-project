import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() signInDto: Record<string, any>) {
    // รับ username/password จาก Body แล้วส่งไปให้ AuthService ตรวจสอบ
    return this.authService.signIn(signInDto.username, signInDto.password);
  }
}   