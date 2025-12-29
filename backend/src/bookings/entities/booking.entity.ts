import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { SportField } from '../../sport-fields/entities/sport-field.entity';

export enum BookingStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    CANCELLED = 'cancelled',
}

@Entity()
export class Booking {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'timestamp' })
    startTime: Date;

    @Column({ type: 'timestamp' })
    endTime: Date;

    @Column({
        type: 'enum',
        enum: BookingStatus,
        default: BookingStatus.PENDING,
    })
    status: BookingStatus;

    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => SportField, (sportField) => sportField.bookings)
    sportField: SportField;
}

