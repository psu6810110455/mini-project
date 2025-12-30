import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Check, Lock } from 'lucide-react';
import { TimeSlotSkeleton } from './ui/Skeleton';

// Pure Component: Receives 'slots' and 'loading' from Parent
const TimeSlotGrid = ({
    slots,
    loading,
    onSelectSlot,
    selectedSlot,
    selectedDate,
    onDateChange
}) => {

    // Date Logic (View Only)
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        dates.push({
            fullDate: d.toISOString().split('T')[0],
            dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
            dayNum: d.getDate(),
            fullString: d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
        });
    }

    return (
        <section className="mb-24" aria-labelledby="time-heading">
            <h2 id="time-heading" className="text-3xl font-bold text-text-main mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-teal text-white text-xl font-bold">2</span>
                Date & Time
            </h2>

            {/* Horizontal Date Picker */}
            <div className="flex gap-4 overflow-x-auto pb-6 -mx-2 px-2 snap-x scrollbar-hide mb-6" role="list">
                {dates.map(date => {
                    const isSelected = selectedDate === date.fullDate;
                    return (
                        <button
                            key={date.fullDate}
                            onClick={() => onDateChange(date.fullDate)}
                            aria-selected={isSelected}
                            className={`snap-start flex-shrink-0 w-24 h-28 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 border-2
                                ${isSelected
                                    ? 'bg-primary-teal border-primary-teal text-white shadow-lg scale-105'
                                    : 'bg-white border-gray-100 text-text-muted hover:border-primary-teal hover:bg-soft-bg'}`}
                        >
                            <span className="text-sm font-bold uppercase mb-1">{date.dayName}</span>
                            <span className="text-3xl font-bold mb-1">{date.dayNum}</span>
                        </button>
                    );
                })}
            </div>

            {/* Time Slots Grid */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm min-h-[300px]">

                {/* 1. Loading State: Skeleton */}
                {loading ? (
                    <TimeSlotSkeleton />
                ) : (
                    /* 2. Loaded State: Grid */
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {slots.map((slot) => {
                            const isAvailable = slot.status === 'available';
                            const isSelected = selectedSlot === slot.time;

                            return (
                                <button
                                    key={slot.time}
                                    onClick={() => isAvailable && onSelectSlot(slot.time)}
                                    disabled={!isAvailable}
                                    className={`
                                        relative w-full h-16 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-between px-6 border-2
                                        ${!isAvailable
                                            ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed bg-striped' // Booked
                                            : isSelected
                                                ? 'bg-primary-teal border-primary-teal text-white shadow-md scale-[1.03] z-10' // Selected
                                                : 'bg-white border-gray-200 text-primary-teal hover:border-primary-teal hover:shadow-md' // Available
                                        }
                                    `}
                                >
                                    <span className="flex items-center gap-2">
                                        <Clock size={20} className={!isAvailable ? "opacity-50" : ""} />
                                        {slot.time}
                                    </span>

                                    {!isAvailable ? (
                                        <Lock size={16} className="text-gray-300" />
                                    ) : isSelected && (
                                        <Check size={24} strokeWidth={3} />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Legend */}
                {!loading && (
                    <div className="flex justify-center flex-wrap gap-6 mt-8 pt-6 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-white border-2 border-primary-teal"></div>Available
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-primary-teal"></div>Selected
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-gray-100 border border-gray-200"></div>Booked
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default TimeSlotGrid;
