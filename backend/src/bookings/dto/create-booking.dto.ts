import { IsNotEmpty, IsDateString, IsNumber } from 'class-validator';

export class CreateBookingDto {
    @IsNotEmpty()
    @IsDateString()
    startTime: string;

    @IsNotEmpty()
    @IsDateString()
    endTime: string;

    @IsNotEmpty()
    @IsNumber()
    sportFieldId: number;
}
