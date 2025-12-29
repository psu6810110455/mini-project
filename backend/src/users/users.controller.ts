import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Guard ชั้นแรก
import { RolesGuard } from '../auth/roles.guard';     // ✅ Guard ชั้นสอง (เพิ่มบรรทัดนี้)
import { Roles } from '../auth/roles.decorator';      // ✅ ตัวแปะป้าย (เพิ่มบรรทัดนี้)

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ใครก็ได้สมัครได้ (ไม่ต้องล็อกอิน)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // 🔒 ด่านนี้โหด! ต้องล็อกอิน (JwtAuthGuard) AND ต้องเป็น Admin (RolesGuard)
  @UseGuards(JwtAuthGuard, RolesGuard) // ✅ เรียกยาม 2 คน
  @Roles('admin')                      // ✅ แปะป้ายว่า "เฉพาะ admin"
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard) // อันนี้ดูข้อมูลตัวเอง ให้เข้าได้ทุกคน (แค่ล็อกอินก็พอ)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard) // ✅ ลบคนอื่น ต้องเป็น Admin เท่านั้น
  @Roles('admin')                      // ✅ แปะป้าย admin
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
  
  // (ส่วน Patch ก็ทำคล้ายๆ กันได้ครับ)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
      return this.usersService.update(+id, updateUserDto);
  }
}