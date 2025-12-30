import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  async create(bookingData: any, userId: number) {
    const { sportFieldId, bookingDate, startTime, endTime } = bookingData;

    const overlapBooking = await this.bookingRepository.findOne({
      where: [
        {
          sportField: { id: sportFieldId },
          bookingDate: bookingDate,
          status: 'confirmed',
          startTime: LessThanOrEqual(endTime), 
          endTime: MoreThanOrEqual(startTime),
        },
      ],
    });

    if (overlapBooking) {
      throw new BadRequestException(
        `ไม่สามารถจองได้ เนื่องจากช่วงเวลา ${startTime} - ${endTime} มีผู้จองสนามนี้ไว้แล้ว`,
      );
    }

    const booking = this.bookingRepository.create({
      ...bookingData,
      user: { id: userId },
      sportField: { id: sportFieldId },
      status: 'confirmed',
    });

    return await this.bookingRepository.save(booking);
  }

  async findMyBookings(userId: number) {
    return await this.bookingRepository.find({
      where: { user: { id: userId } },
      relations: ['sportField'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAll() {
    return await this.bookingRepository.find({
      relations: ['user', 'sportField'],
      order: { bookingDate: 'ASC', startTime: 'ASC' },
    });
  }

  // ✅ เพิ่มฟังก์ชันนี้เพื่อให้เส้นหยักใน Controller หายไป
  async cancel(id: number) {
    const booking = await this.bookingRepository.findOne({ where: { id } });
    
    if (!booking) {
      throw new NotFoundException(`ไม่พบรายการจองรหัส ${id}`);
    }

    // อัปเดตสถานะเป็นยกเลิก
    booking.status = 'cancelled';
    return await this.bookingRepository.save(booking);
  }
}