import axios from 'axios';

const API_URL = 'http://localhost:3000';

const getSportFields = async () => {
    const response = await axios.get(`${API_URL}/sport-fields`);
    return response.data;
};

const createBooking = async (bookingData) => {
    const response = await axios.post(`${API_URL}/bookings`, bookingData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    return response.data;
};

// ADAPTER: Transforms backend Booking List -> Frontend Slot Status Array
const getSlotsForDate = async (sportFieldId, date) => {
    // 1. Fetch raw bookings (e.g., [{ startTime: '2023-10-25T13:00' ... }])
    const response = await axios.get(`${API_URL}/bookings/availability?sportFieldId=${sportFieldId}&date=${date}`);
    const bookedTimes = response.data;

    // 2. Generate 08:00 - 22:00 slots
    const slots = [];
    for (let i = 8; i < 22; i++) {
        const hour = i.toString().padStart(2, '0');
        const timeStr = `${hour}:00`;

        // Check if this time matches any booked slot
        const isBooked = bookedTimes.some(b => {
            const bookedHour = new Date(b.startTime).getHours();
            return bookedHour === i;
        });

        slots.push({
            time: timeStr,
            status: isBooked ? 'booked' : 'available', // Strict status as requested
        });
    }

    return slots;
};

export default {
    getSportFields,
    createBooking,
    getSlotsForDate
};
