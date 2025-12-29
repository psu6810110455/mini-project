import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. ดูว่าห้องนี้แปะป้าย roles อะไรไว้บ้าง (เช่น 'admin')
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // 2. ถ้าไม่ได้แปะป้ายอะไรไว้ แปลว่าใครก็เข้าได้ -> ปล่อยผ่าน
    if (!requiredRoles) {
      return true;
    }

    // 3. ดึงข้อมูล User ออกมาจาก Request (ที่ได้จาก JWT Guard)
    const { user } = context.switchToHttp().getRequest();

    // 4. เช็คว่า Role ของ User ตรงกับที่ห้องต้องการไหม
    // ถ้า User มี role เป็น 'admin' และห้องต้องการ 'admin' ก็จะผ่าน
    return requiredRoles.some((role) => user.role?.includes(role));
  }
}