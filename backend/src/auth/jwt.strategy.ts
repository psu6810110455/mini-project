import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret, // 🔑 จุดสำคัญ: ต้องตรงกับ AuthModule
    });
  }

  async validate(payload: any) {
    // ถ้า Token ผ่าน ข้อมูลนี้จะไปโผล่ใน request.user
    return { userId: payload.sub, username: payload.username, role: payload.role };
  }
}