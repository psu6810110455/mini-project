import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking, BookingStatus } from './entities/booking.entity';
import { User } from '../users/entities/user.entity';
import { SportField } from '../sport-fields/entities/sport-field.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
  ) { }

  async create(createBookingDto: CreateBookingDto, user: User) {
    const { sportFieldId, startTime, endTime } = createBookingDto;

    // 1. ตรวจสอบว่ามีสนามนี้จริงไหม
    const sportField = await this.bookingsRepository.manager.findOne(SportField, {
      where: { id: sportFieldId },
    });

    if (!sportField) {
      throw new NotFoundException(`ไม่พบสนามหมายเลข #${sportFieldId} ครับ กรุณาสร้างสนามก่อนครับ`);
    }

    // 2. ตรวจสอบรูปแบบวันที่
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('รูปแบบวันที่ไม่ถูกต้องครับ');
    }

    if (start >= end) {
      throw new BadRequestException('เวลาเริ่มต้องมาก่อนเวลาเลิกครับ');
    }

    // 3. ✨ [Complex Logic] ตรวจสอบการจองซ้อน (Overlap Prevention)
    // เงื่อนไขการซ้อนทับ: (เวลาเริ่มใหม่ < เวลาจบเดิม) และ (เวลาจบใหม่ > เวลาเริ่มเดิม)
    const overlap = await this.bookingsRepository.createQueryBuilder('booking')
      .where('booking.sportFieldId = :sportFieldId', { sportFieldId })
      .andWhere('booking.status IN (:...statuses)', {
        statuses: [BookingStatus.PENDING, BookingStatus.CONFIRMED]
      })
      .andWhere('booking.startTime < :end AND booking.endTime > :start', {
        start,
        end
      })
      .getOne();

    if (overlap) {
      throw new ConflictException('ขออภัยครับ เวลานี้สนามถูกจองไปแล้ว กรุณาเลือกช่วงเวลาอื่นครับ');
    }

    const booking = this.bookingsRepository.create({
      startTime: start,
      endTime: end,
      status: BookingStatus.PENDING,
      user: { id: user.id } as User,
      sportField: sportField,
    });

    return this.bookingsRepository.save(booking);
  }

  async findMyBookings(userId: number) {
    return this.bookingsRepository.find({
      where: { user: { id: userId } },
      relations: ['sportField'],
      order: { startTime: 'DESC' },
    });
  }

  async findAll() {
    return this.bookingsRepository.find({
      relations: ['user', 'sportField'],
    });
  }

  async findOne(id: number) {
    const booking = await this.bookingsRepository.findOne({
      where: { id },
      relations: ['user', 'sportField'],
    });
    if (!booking) {
      throw new NotFoundException(`Booking #${id} not found`);
    }
    return booking;
  }

  async cancel(id: number) {
    const booking = await this.findOne(id);
    booking.status = BookingStatus.CANCELLED;
    return this.bookingsRepository.save(booking);
  }

  async update(id: number, updateBookingDto: UpdateBookingDto) {
    const booking = await this.findOne(id);
    Object.assign(booking, updateBookingDto);
    return this.bookingsRepository.save(booking);
  }

  async remove(id: number) {
    const booking = await this.findOne(id);
    return this.bookingsRepository.remove(booking);
  }
}
