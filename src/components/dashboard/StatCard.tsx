
import React from 'react';
import { cn } from '@/lib/utils';

type StatCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string;
  change?: {
    value: string;
    type: 'increase' | 'decrease';
  };
  color: 'blue' | 'green' | 'orange' | 'purple';
};

const colorMap = {
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-500'
  },
  green: {
    bg: 'bg-green-100',
    text: 'text-green-500'
  },
  orange: {
    bg: 'bg-orange-100',
    text: 'text-orange-500'
  },
  purple: {
    bg: 'bg-purple-100',
    text: 'text-purple-500'
  },
};

export function StatCard({ icon, title, value, change, color }: StatCardProps) {
  return (
    <div className="stat-card rounded-lg border p-4 flex items-center gap-4">
      <div className={cn('stat-icon w-10 h-10 rounded-full flex items-center justify-center', colorMap[color].bg, colorMap[color].text)}>
        {icon}
      </div>
      <div className='flex flex-col'>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-xl font-semibold">{value}</h3>
        {change && (
          <p className={cn(
            'text-xs',
            change.type === 'increase' ? 'text-green-500' : 'text-red-500'
          )}>
            {change.type === 'increase' ? '↑' : '↓'} {change.value}
          </p>
        )}
      </div>
    </div>
  );
}
