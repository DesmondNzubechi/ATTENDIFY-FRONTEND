// components/attendance/AttendanceSkeleton.tsx
import React from 'react';
import { cn } from '@/lib/utils'; // Optional utility for merging classes

export const AttendanceSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Top filters and buttons */}
      <div className="flex justify-between items-center">
        <div className="h-10 w-1/3 bg-gray-200 rounded-md" />
        <div className="flex gap-2">
          <div className="h-10 w-24 bg-gray-200 rounded-md" />
          <div className="h-10 w-24 bg-gray-200 rounded-md" />
        </div>
      </div>

      {/* Sessions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 border border-gray-200 rounded-lg space-y-2">
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
            <div className="h-4 w-1/2 bg-gray-200 rounded" />
            <div className="h-4 w-1/3 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      {/* Attendance Table */}
      <div className="mt-6">
        <div className="h-10 w-full bg-gray-200 rounded-md mb-2" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-4 w-1/6 bg-gray-200 rounded" />
              <div className="h-4 w-1/3 bg-gray-200 rounded" />
              <div className="h-4 w-1/4 bg-gray-200 rounded" />
              <div className="h-4 w-1/5 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
