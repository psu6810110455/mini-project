import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) { }

  // 1. Create Booking (User จอง)
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createBookingDto: CreateBookingDto, @Request() req) {
    return this.bookingsService.create(createBookingDto, req.user);
  }

  // 2. Get My Bookings (ดูประวัติ)
  @UseGuards(JwtAuthGuard)
  @Get('my')
  findMyBookings(@Request() req) {
    return this.bookingsService.findMyBookings(req.user.id);
  }

  // สำหรับ Admin ดูทั้งหมด
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }

  // 4. Check Availability (Public)
  @Get('availability')
  checkAvailability(@Query('sportFieldId') sportFieldId: string, @Query('date') date: string) {
    return this.bookingsService.checkAvailability(+sportFieldId, date);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(+id);
  }

  // 3. Cancel Booking (สำหรับ Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.bookingsService.cancel(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.update(+id, updateBookingDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(+id);
  }
}
