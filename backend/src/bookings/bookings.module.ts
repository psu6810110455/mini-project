import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // ✅ 1
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from './entities/booking.entity'; // ✅ 2

@Module({
  imports: [TypeOrmModule.forFeature([Booking])], // ✅ 3
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}