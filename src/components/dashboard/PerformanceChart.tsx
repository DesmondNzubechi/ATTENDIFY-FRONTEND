
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAttendanceStore } from '@/stores/useAttendanceStore';

export function PerformanceChart() {
  const { sessions } = useAttendanceStore();
  const [data, setData] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    if (sessions.length === 0) return;

    // Extract last 6-9 courses based on creation date
    const sortedSessions = [...sessions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ).slice(0, 9);

    // Process the attendance data
    const processedData = sortedSessions.map(session => {
      const today = new Date().toISOString().split('T')[0];
      
      const presentCount = session.students.filter(s => {
        return Object.values(s.attendance).some(a => a.status === 'present');
      }).length;
      
      const absentCount = session.students.filter(s => {
        return Object.values(s.attendance).some(a => a.status === 'absent');
      }).length;
      
      return {
        month: session.course.substring(0, 3),
        primary: presentCount,
        secondary: absentCount,
        course: session.course,
        courseCode: session.courseCode
      };
    });

    setData(processedData);
  }, [sessions, timeRange]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-medium">Performance</CardTitle>
          <CardDescription className="text-xs">Student attendance performance</CardDescription>
        </div>
        <div className="flex items-center text-xs space-x-4">
          <button 
            className={`${timeRange === 'week' ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'}`}
            onClick={() => setTimeRange('week')}
          >
            Week
          </button>
          <button 
            className={`${timeRange === 'month' ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'}`}
            onClick={() => setTimeRange('month')}
          >
            Month
          </button>
          <button 
            className={`${timeRange === 'year' ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'}`}
            onClick={() => setTimeRange('year')}
          >
            Year
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.length > 0 ? data : []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(value) => value}
              />
              <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip 
                formatter={(value, name) => {
                  const formattedName = name === 'primary' ? 'Present' : 'Absent';
                  return [value, formattedName];
                }}
                labelFormatter={(label, payload) => {
                  if (payload && payload.length > 0) {
                    return payload[0].payload.course;
                  }
                  return label;
                }}
              />
              <Bar dataKey="secondary" fill="#ef4444" name="Absent" radius={[4, 4, 0, 0]} />
              <Bar dataKey="primary" fill="#22c55e" name="Present" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
