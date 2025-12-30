import React from 'react';

const Skeleton = ({ className, ...props }) => {
    return (
        <div
            className={`animate-pulse bg-gray-200 rounded-xl ${className}`}
            {...props}
        />
    );
};

export const TimeSlotSkeleton = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
            ))}
        </div>
    );
};

export default Skeleton;
