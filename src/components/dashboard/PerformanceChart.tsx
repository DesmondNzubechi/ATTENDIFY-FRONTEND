
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { month: 'Jan', primary: 65, secondary: 45 },
  { month: 'Feb', primary: 75, secondary: 55 },
  { month: 'Mar', primary: 60, secondary: 40 },
  { month: 'Apr', primary: 90, secondary: 70 },
  { month: 'May', primary: 65, secondary: 45 },
  { month: 'Jun', primary: 80, secondary: 60 },
  { month: 'Jul', primary: 90, secondary: 70 },
  { month: 'Aug', primary: 75, secondary: 55 },
  { month: 'Sep', primary: 65, secondary: 45 },
];

export function PerformanceChart() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-medium">Performance</CardTitle>
          <CardDescription className="text-xs">Student performance over time</CardDescription>
        </div>
        <div className="flex items-center text-xs space-x-4">
          <button className="text-blue-500">Week</button>
          <button className="text-gray-500 hover:text-blue-500">Month</button>
          <button className="text-gray-500 hover:text-blue-500">Year</button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="secondary" fill="#1e40af" radius={[4, 4, 0, 0]} />
              <Bar dataKey="primary" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
