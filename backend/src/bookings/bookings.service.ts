import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
  ) {}

  async create(createBookingDto: any, userId: number) {
    const { sportFieldId, bookingDate, startTime, endTime } = createBookingDto;

    // เช็คเวลาจองซ้อน (Complex Logic #4)
    const overlap = await this.bookingsRepository.createQueryBuilder('booking')
      .where('booking.sportFieldId = :fieldId', { fieldId: sportFieldId })
      .andWhere('booking.bookingDate = :date', { date: bookingDate })
      .andWhere('booking.status = :status', { status: 'confirmed' })
      .andWhere(
        '(booking.startTime < :end AND booking.endTime > :start)',
        { start: startTime, end: endTime }
      )
      .getOne();

    if (overlap) {
      throw new BadRequestException('ไม่สามารถจองได้ เนื่องจากช่วงเวลานี้มีผู้จองแล้ว');
    }

    const newBooking = this.bookingsRepository.create({
      ...createBookingDto,
      user: { id: userId },
      sportField: { id: sportFieldId },
      status: 'confirmed',
    });

    return this.bookingsRepository.save(newBooking);
  }

  // ✅ เพิ่มฟังก์ชันนี้เพื่อให้ Error ใน Controller หายไป
  async findAllByUser(userId: number) {
    return this.bookingsRepository.find({
      where: { user: { id: userId } },
      relations: ['sportField'], // ดึงข้อมูลสนามมาโชว์ด้วย
      order: { id: 'DESC' },     // เอาที่จองล่าสุดขึ้นก่อน
    });
  }

  async findAll() {
    return this.bookingsRepository.find({ relations: ['user', 'sportField'] });
  }

  async cancel(id: number) {
    const booking = await this.bookingsRepository.findOne({ where: { id } });
    if (!booking) throw new NotFoundException('ไม่พบรายการจอง');
    
    booking.status = 'cancelled';
    return this.bookingsRepository.save(booking);
  }
}