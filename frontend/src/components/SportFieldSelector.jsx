import React, { useEffect, useState } from 'react';
import BookingService from '../services/booking.service';
import { Loader2, ArrowRight } from 'lucide-react';

const SportFieldSelector = ({ onSelectField }) => {
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFields = async () => {
            try {
                const data = await BookingService.getSportFields();
                setFields(data);
            } catch (error) {
                console.error("Failed to fetch fields", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFields();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map((field, index) => {
                const bgImage = `https://images.unsplash.com/photo-${index % 2 === 0 ? '1529900748604-07564a03e7a6' : '1531415074984-9569140f1c6c'}?q=80&w=800&auto=format&fit=crop`;

                return (
                    <div
                        key={field.id}
                        className="bg-white border border-gray-200 rounded shadow-sm hover:shadow-md transition-shadow flex flex-col"
                    >
                        {/* Image Top */}
                        <div className="h-48 overflow-hidden bg-gray-100">
                            <img
                                src={bgImage}
                                alt={field.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Card Body */}
                        <div className="p-4 flex flex-col flex-grow">
                            <div className="text-sm text-[#6c757d] mb-1">ประเภท {field.category || 'สนามเทนนิส'}</div>
                            <h3 className="text-2xl font-bold text-[#212529] mb-3">{field.name}</h3>

                            <div className="text-base text-[#212529] mb-4">
                                เปิดเวลา {field.openTime || '08:00:00'} | ปิด {field.closeTime || '20:00:00'}
                            </div>

                            <button
                                onClick={() => onSelectField(field)}
                                className="mt-auto w-max px-4 py-2 rounded bg-[#198754] hover:bg-[#157347] text-white font-medium text-sm flex items-center gap-1 transition-colors"
                            >
                                จองสนาม &rarr;
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default SportFieldSelector;
