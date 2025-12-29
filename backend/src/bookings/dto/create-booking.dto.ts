import { IsNotEmpty, IsDateString, IsNumber } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsNumber()
  sportFieldId: number;

  @IsNotEmpty()
  @IsDateString() // บังคับส่งวันที่เป็น ISO8601 (เช่น "2025-01-01T10:00:00Z")
  startTime: string;

  @IsNotEmpty()
  @IsDateString()
  endTime: string;
}