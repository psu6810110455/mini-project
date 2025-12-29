import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, Between, LessThan, MoreThan } from 'typeorm';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
  ) {}

  async create(createBookingDto: CreateBookingDto, userId: number) {
    const { sportFieldId, startTime, endTime } = createBookingDto;
    
    // แปลง string เป็น Date Object
    const start = new Date(startTime);
    const end = new Date(endTime);

    // 1. ตรวจสอบเวลา: เวลาจบต้องมากกว่าเวลาเริ่มเสมอ
    if (end <= start) {
      throw new BadRequestException('เวลาจบต้องอยู่หลังเวลาเริ่มครับ');
    }

    // 2. 🛡️ เช็คว่าชนกับคนอื่นไหม? (Logic ขั้นเทพ)
    // สูตร: (JobStart < NewEnd) AND (JobEnd > NewStart)
    const existingBooking = await this.bookingsRepository.findOne({
      where: {
        sportFieldId: sportFieldId,
        startTime: LessThan(end),
        endTime: MoreThan(start),
      },
    });

    if (existingBooking) {
      throw new ConflictException('เสียใจด้วยครับ สนามนี้ไม่ว่างในช่วงเวลานั้น 😭');
    }

    // 3. ถ้าว่าง ก็บันทึกเลย!
    const booking = this.bookingsRepository.create({
      ...createBookingDto,
      startTime: start,
      endTime: end,
      userId, // เอา ID คนจองใส่เข้าไป
    });

    return this.bookingsRepository.save(booking);
  }

  // ดึงรายการจองทั้งหมด (ของทุกคน)
  findAll() {
    return this.bookingsRepository.find({
      relations: ['user', 'sportField'], // join ตารางมาดูชื่อคนกับชื่อสนาม
      order: { startTime: 'DESC' }
    });
  }
}