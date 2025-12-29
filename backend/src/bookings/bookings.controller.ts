import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // 🔒 ยามตรวจบัตร

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @UseGuards(JwtAuthGuard) // 🔒 ต้องล็อกอิน
  @Post()
  create(@Request() req, @Body() createBookingDto: CreateBookingDto) {
    // ดึง UserID จาก Token (req.user) ส่งไปให้ Service
    return this.bookingsService.create(createBookingDto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }
}