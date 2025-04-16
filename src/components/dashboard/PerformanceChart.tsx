import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAttendanceStore } from '@/stores/useAttendanceStore';

export function PerformanceChart() {
  const { sessions } = useAttendanceStore();
  const [data, setData] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    if (sessions.length === 0) return;

    // Sort sessions by date (newest to oldest)
    const sortedSessions = [...sessions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Limit based on time range
    let filteredSessions = sortedSessions;
    const currentDate = new Date();
    
    if (timeRange === 'week') {
      // Get sessions from the last 7 days
      const oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredSessions = sortedSessions.filter(session => 
        new Date(session.date) >= oneWeekAgo
      );
      
      // Take at most 7 sessions
      filteredSessions = filteredSessions.slice(0, 7);
    } else if (timeRange === 'month') {
      // Get sessions from the last 30 days
      const oneMonthAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
      filteredSessions = sortedSessions.filter(session => 
        new Date(session.date) >= oneMonthAgo
      );
      
      // Take at most 9 sessions for readability
      filteredSessions = filteredSessions.slice(0, 9);
    } else {
      // For year, take the most recent 12 sessions
      filteredSessions = sortedSessions.slice(0, 12);
    }

    // Process the attendance data
    const processedData = filteredSessions.map(session => {
      // Count present students
      const presentCount = session.students.filter(student => 
        Object.values(student.attendance).some(a => a.status === 'present')
      ).length;
      
      // Count absent students
      const absentCount = session.students.filter(student => 
        Object.values(student.attendance).some(a => a.status === 'absent')
      ).length;
      
      // Count unmarked (total - (present + absent))
      const totalStudents = session.students.length;
      const unmarkedCount = totalStudents - (presentCount + absentCount);
      
      return {
        month: getCourseAbbreviation(session.course),
        present: presentCount,
        absent: absentCount,
        unmarked: unmarkedCount,
        course: session.course,
        courseCode: session.courseCode,
        total: totalStudents
      };
    });

    setData(processedData.reverse()); // Reverse to show oldest to newest (left to right)
  }, [sessions, timeRange]);

  // Function to get course abbreviation
  const getCourseAbbreviation = (courseName: string) => {
    // If course is short (less than 4 chars), use it as is
    if (courseName.length <= 4) return courseName;
    
    // Otherwise create abbreviation (first 3 chars)
    return courseName.substring(0, 3);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div> 
          <CardTitle className="text-base font-medium">Attendance Performance</CardTitle>
          <CardDescription className="text-xs">Student attendance statistics</CardDescription>
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
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip 
                formatter={(value, name) => {
                  let formattedName = name;
                  switch (name) {
                    case 'present': formattedName = 'Present'; break;
                    case 'absent': formattedName = 'Absent'; break;
                    case 'unmarked': formattedName = 'Not Marked'; break;
                  }
                  return [value, formattedName];
                }}
                labelFormatter={(label, payload) => {
                  if (payload && payload.length > 0) {
                    return payload[0].payload.course;
                  }
                  return label;
                }}
              />
              <Legend />
              <Bar dataKey="absent" fill="#ef4444" name="Absent" radius={[4, 4, 0, 0]} />
              <Bar dataKey="present" fill="#22c55e" name="Present" radius={[4, 4, 0, 0]} />
              <Bar dataKey="unmarked" fill="#9ca3af" name="Not Marked" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
