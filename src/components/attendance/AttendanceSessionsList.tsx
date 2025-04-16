
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, XCircle, Calendar, Clock, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAttendanceStore } from '@/stores/useAttendanceStore';
import { AttendanceSession } from '@/stores/useAttendanceStore';
import { Button } from '@/components/ui/button';

interface AttendanceSessionsListProps {
  filteredSessions: AttendanceSession[];
  onDelete?: (sessionId: string) => void;
}

export const AttendanceSessionsList = ({ filteredSessions, onDelete }: AttendanceSessionsListProps) => {
  const { selectedSession, setSelectedSession } = useAttendanceStore();
  
  const handleSessionClick = (session: AttendanceSession) => {
    setSelectedSession(session);
  };

  const handleDeleteClick = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation(); // Prevent session selection
    if (onDelete) {
      onDelete(sessionId);
    }
  };

  return (
    <Card className="lg:col-span-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">Attendance Sessions</CardTitle>
        <span className="text-xs text-gray-500">{filteredSessions.length} sessions</span>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          {filteredSessions.length === 0 ? (
            <div className="text-center py-10">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No sessions found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try creating a new attendance session or adjusting your search.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredSessions.map((session) => {
                // Count present and absent students
                const presentCount = session.students.filter(s => 
                  Object.values(s.attendance).some(a => a.status === 'present')
                ).length;
                
                const absentCount = session.students.filter(s => 
                  Object.values(s.attendance).some(a => a.status === 'absent')
                ).length;
                
                // Format creation date
                const creationDate = new Date(session.date);
                const formattedDate = formatDistanceToNow(creationDate, { addSuffix: true });
                
                return (
                  <div 
                    key={session.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedSession?.id === session.id 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleSessionClick(session)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium text-gray-900">{session.course}</h3>
                          <span className="text-xs font-medium rounded-full px-2 py-0.5 bg-blue-100 text-blue-800">
                            {session.courseCode}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">{session.sessionName} | Level {session.level}</p>
                        <p className="mt-1 text-xs text-gray-500">{session.semester}</p>
                      </div>
                      <div className="flex items-center">
                        <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${
                          session.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {session.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2 p-0 h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={(e) => handleDeleteClick(e, session.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center text-green-600">
                          <CheckCircle size={14} className="mr-1" />
                          <span>{presentCount} Present</span>
                        </div>
                        <div className="flex items-center text-red-600">
                          <XCircle size={14} className="mr-1" />
                          <span>{absentCount} Absent</span>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Clock size={14} className="mr-1" />
                        <span>{formattedDate}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
