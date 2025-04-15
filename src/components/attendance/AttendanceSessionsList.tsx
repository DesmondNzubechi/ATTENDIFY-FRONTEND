
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAttendanceStore, AttendanceSession } from '@/stores/useAttendanceStore';
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface AttendanceSessionsListProps {
  filteredSessions: AttendanceSession[];
}

export const AttendanceSessionsList = ({ filteredSessions }: AttendanceSessionsListProps) => {
  const { 
    selectedSession, 
    setSelectedSession, 
    deleteSession 
  } = useAttendanceStore();
  const { toast } = useToast();

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

  const handleDeleteSession = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    try {
      await deleteSession(sessionId);
      toast({
        title: "Session Deleted",
        description: "Attendance session has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete session. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="lg:col-span-8">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Attendance Sessions</span>
          <Badge className="bg-blue-500">{filteredSessions.length} Sessions</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className=" max-h-[60vh] overflow-y-auto">
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
                  <div className="flex-grow">
                    <h3 className="font-medium">{session.course} ({session.courseCode})</h3>
                    <p className="text-sm text-gray-500">Level: {session.level} | {session.sessionName}</p>
                    <p className="text-xs text-gray-400">
                      Date: {formatDate(session.date)} ({getTimeAgo(session.date)})
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Semester: {session.semester}
                    </p>
                    
                    <div className="flex mt-2">
                      {session.students?.length > 0 && (
                        <div className="flex items-center mr-3">
                          <div className="flex items-center text-xs text-green-600">
                            <CheckCircle size={12} className="mr-1" />
                            {session.students.filter(s => {
                              const today = new Date().toISOString().split('T')[0];
                              return s.attendance[today]?.status === 'present';
                            }).length} Present
                          </div>
                          <div className="flex items-center text-xs text-red-600 ml-2">
                            <XCircle size={12} className="mr-1" />
                            {session.students.filter(s => {
                              const today = new Date().toISOString().split('T')[0];
                              return s.attendance[today]?.status === 'absent';
                            }).length} Absent
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    {session.isActive ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200 mb-2">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-200 mb-2">
                        Inactive
                      </Badge>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={(e) => handleDeleteSession(e, session.id)}
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
