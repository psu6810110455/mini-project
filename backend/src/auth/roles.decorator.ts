import { SetMetadata } from '@nestjs/common';

// นี่คือคำสั่งสร้างป้ายชื่อ @Roles('admin') เอาไว้แปะหัว Controller
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);