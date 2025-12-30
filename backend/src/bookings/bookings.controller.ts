import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: any, @Request() req) {
    return this.bookingsService.create(body, req.user.userId);
  }

  // ✅ ต้องวาง 'my' ไว้บนสุด เพื่อไม่ให้โดน :id แย่งจับ Error 404
  @UseGuards(JwtAuthGuard)
  @Get('my')
  findMyBookings(@Request() req) {
    return this.bookingsService.findAllByUser(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.bookingsService.cancel(+id);
  }
}