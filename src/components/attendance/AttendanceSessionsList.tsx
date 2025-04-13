
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAttendanceStore, AttendanceSession } from '@/stores/useAttendanceStore';
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';

interface AttendanceSessionsListProps {
  filteredSessions: AttendanceSession[];
}

export const AttendanceSessionsList = ({ filteredSessions }: AttendanceSessionsListProps) => {
  const { selectedSession, setSelectedSession } = useAttendanceStore();

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return dateString; // Return the original string if parsing fails
    }
  };

  const getTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'date unknown';
    }
  };

  return (
    <Card className="lg:col-span-4">
      <CardHeader>
        <CardTitle>Attendance Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {filteredSessions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No attendance sessions found.</p>
          ) : (
            filteredSessions?.map((session) => (
              <div 
                key={session.id} 
                className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${selectedSession?.id === session.id ? 'border-blue-500 bg-blue-50' : ''}`}
                onClick={() => setSelectedSession(session)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{session.course} ({session.courseCode})</h3>
                    <p className="text-sm text-gray-500">Level: {session.level} | {session.sessionName}</p>
                    <p className="text-xs text-gray-400">
                      Date: {formatDate(session.date)} ({getTimeAgo(session.date)})
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Semester: {session.semester}
                    </p>
                  </div>
                  {session.isActive ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                      Inactive
                    </Badge>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
