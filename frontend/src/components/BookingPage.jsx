import React, { useState, useEffect } from 'react';
import SportFieldSelector from './SportFieldSelector';
import TimeSlotGrid from './TimeSlotPicker';
import BookingService from '../services/booking.service';
import Swal from 'sweetalert2';
import { ArrowRight, Search } from 'lucide-react';

const BookingPage = () => {
    const [selectedField, setSelectedField] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [bookingState, setBookingState] = useState('idle');

    // Fetch Slots Effect
    useEffect(() => {
        if (!selectedField) return;

        const fetchSlots = async () => {
            setIsLoading(true);
            setSlots([]);
            try {
                const data = await BookingService.getSlotsForDate(selectedField.id, selectedDate);
                setSlots(data);
                if (selectedSlot) {
                    const slotStillAvailable = data.find(s => s.time === selectedSlot && s.status === 'available');
                    if (!slotStillAvailable) setSelectedSlot(null);
                }
            } catch (error) {
                console.error("Error fetching slots:", error);
                Swal.fire('Error', 'Unable to load time slots.', 'error');
            } finally {
                setTimeout(() => setIsLoading(false), 500);
            }
        };
        fetchSlots();
    }, [selectedField, selectedDate]);

    const handleConfirmBooking = async () => {
        if (!selectedField || !selectedSlot) return;
        setBookingState('loading');
        try {
            const startStr = `${selectedDate}T${selectedSlot}:00`;
            const endHour = parseInt(selectedSlot.split(':')[0]) + 1;
            const endStr = `${selectedDate}T${endHour.toString().padStart(2, '0')}:00:00`;

            await BookingService.createBooking({
                sportFieldId: selectedField.id,
                startTime: startStr,
                endTime: endStr,
            });

            setBookingState('success');
            await Swal.fire({
                title: 'Booking Confirmed!',
                text: 'Your court has been successfully reserved.',
                icon: 'success',
                confirmButtonColor: '#198754'
            });

            setBookingState('idle');
            setSelectedSlot(null);
            // Close the booking view to return to list
            setSelectedField(null);

        } catch (error) {
            console.error(error);
            setBookingState('error');
            Swal.fire('Booking Failed', 'Something went wrong.', 'error');
        } finally {
            if (bookingState !== 'success') setBookingState('idle');
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] font-sans text-[#212529]">

            {/* 1. Navbar (Black) */}
            <nav className="bg-[#212529] text-white py-3 shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="font-medium text-lg">จองสนามกีฬา ออนไลน์</div>
                    <div className="flex gap-6 text-sm text-gray-300">
                        <a href="#" className="hover:text-white">หน้าหลัก</a>
                        <a href="#" className="hover:text-white">รายการจอง</a>
                        <a href="#" className="hover:text-white">สมัครสมาชิก</a>
                        <a href="#" className="text-white font-bold">เข้าสู่ระบบ</a>
                    </div>
                </div>
            </nav>

            {/* 2. Page Header (Hero) */}
            <header className="py-12 text-center bg-white border-b border-gray-200 mb-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#212529] mb-2 tracking-tight">Welcome to Book a field!</h1>
                    <p className="text-[#6c757d] text-lg">A Bootstrap 5 starter layout for your next blog homepage</p>
                </div>
            </header>

            {/* 3. Main Content (2 Columns) */}
            <div className="container mx-auto px-4 max-w-7xl pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Field Cards OR Booking View */}
                    <div className="lg:col-span-8">
                        {selectedField ? (
                            <div className="bg-white p-6 rounded border border-gray-200 shadow-sm animate-fade-in-up">
                                <button
                                    onClick={() => setSelectedField(null)}
                                    className="mb-4 text-sm text-[#0d6efd] hover:underline font-medium flex items-center gap-1"
                                >
                                    &larr; กลับหน้ารายการสนาม
                                </button>
                                <h2 className="text-3xl font-bold mb-2">{selectedField.name}</h2>
                                <p className="text-[#6c757d] mb-6">{selectedField.location || 'Stadium Complex'}</p>

                                <TimeSlotGrid
                                    slots={slots}
                                    loading={isLoading}
                                    selectedSlot={selectedSlot}
                                    onSelectSlot={setSelectedSlot}
                                    selectedDate={selectedDate}
                                    onDateChange={setSelectedDate}
                                />

                                {/* Booking Action Area */}
                                <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-between">
                                    <div>
                                        <div className="text-sm text-gray-500 font-bold uppercase tracking-wider">Total Price</div>
                                        <div className="text-4xl font-bold text-[#212529]">{selectedField.price} <span className="text-lg font-normal">THB</span></div>
                                    </div>
                                    <button
                                        onClick={handleConfirmBooking}
                                        disabled={!selectedSlot || bookingState === 'loading'}
                                        className={`px-10 py-3 rounded font-bold text-white transition-all text-lg
                                            ${!selectedSlot ? 'bg-gray-400 cursor-not-allowed' :
                                                bookingState === 'loading' ? 'bg-gray-500' : 'bg-[#198754] hover:bg-[#157347]'}`}
                                    >
                                        {bookingState === 'loading' ? 'Processing...' : 'Confirm Booking'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <SportFieldSelector onSelectField={setSelectedField} />
                        )}
                    </div>

                    {/* Right Column: Widgets */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Search Widget */}
                        <div className="bg-white border border-gray-200 rounded shadow-sm">
                            <div className="bg-[#f8f9fa] border-b border-gray-200 px-4 py-3 font-bold text-[#212529]">
                                ค้นหาสนามกีฬา
                            </div>
                            <div className="p-4">
                                <div className="flex">
                                    <input
                                        type="text"
                                        placeholder="Enter search term..."
                                        className="flex-grow px-3 py-2 border border-gray-300 rounded-l focus:border-[#86b7fe] focus:outline-none focus:ring-4 focus:ring-[#0d6efd]/25 transition-all text-sm"
                                    />
                                    <button className="bg-[#0d6efd] hover:bg-[#0b5ed7] text-white px-4 py-2 rounded-r font-medium text-sm">
                                        ค้นหา
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Categories Widget */}
                        <div className="bg-white border border-gray-200 rounded shadow-sm">
                            <div className="bg-[#f8f9fa] border-b border-gray-200 px-4 py-3 font-bold text-[#212529]">
                                ประเภทสนามกีฬา
                            </div>
                            <div className="p-4">
                                <div className="grid grid-cols-2 gap-x-4 text-[#0d6efd] text-sm">
                                    <ul className="list-disc list-inside space-y-1">
                                        <li><a href="#" className="hover:underline">สนามแบดมินตัน</a></li>
                                        <li><a href="#" className="hover:underline">สนามฟุตบอล</a></li>
                                    </ul>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li><a href="#" className="hover:underline">สนามเทนนิส</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Side Widget */}
                        <div className="bg-white border border-gray-200 rounded shadow-sm">
                            <div className="bg-[#f8f9fa] border-b border-gray-200 px-4 py-3 font-bold text-[#212529]">
                                Side Widget
                            </div>
                            <div className="p-4 text-[#212529] text-sm leading-relaxed">
                                You can put anything you want inside of these side widgets. They are easy to use, and feature the Bootstrap 5 card component!
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
