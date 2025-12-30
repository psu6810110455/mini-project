// src/interfaces.ts

export interface SportField {
  id: number;
  name: string;
  description: string;
  type: string;
}

export interface Booking {
  id: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'cancelled';
  sportField: SportField;
}