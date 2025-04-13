
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAttendanceStore, AttendanceSession } from '@/stores/useAttendanceStore';

interface AttendanceSessionsListProps {
  filteredSessions: AttendanceSession[];
}

export const AttendanceSessionsList = ({ filteredSessions }: AttendanceSessionsListProps) => {
  const { selectedSession, setSelectedSession } = useAttendanceStore();

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
                    <h3 className="font-medium">{session.course}</h3>
                    <p className="text-sm text-gray-500">Level: {session.level} | {session.sessionName}</p>
                    <p className="text-xs text-gray-400">Date: {new Date(session.date).toLocaleDateString()}</p>
                  </div>
                  {session.isActive ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Completed
                    </span>
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
