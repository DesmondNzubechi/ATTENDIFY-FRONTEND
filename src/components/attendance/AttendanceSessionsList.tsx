import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAttendanceStore, AttendanceSession } from '@/stores/useAttendanceStore';
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return dateString;
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

  const handleDeletePrompt = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    setSessionToDelete(sessionId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteSession = async () => {
    if (!sessionToDelete) return;
    try {
      await deleteSession(sessionToDelete);
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
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <Card className="lg:col-span-8">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span className='text-[15px] md:text-[20px] '>Attendance Sessions</span>
            <Badge className="bg-blue-500">{filteredSessions.length} Sessions</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSessions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No attendance sessions found.</p>
          ) : (
            <div className="overflow-auto max-h-[60vh]">
              <table className="min-w-full text-sm text-left border rounded-md">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr>
                    <th className="p-3">Course</th>
                    <th className="p-3">Level</th>
                    <th className="p-3">Session</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Semester</th>
                    <th className="p-3">Present</th>
                    <th className="p-3">Absent</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSessions.map((session) => {
                    const today = new Date().toISOString().split('T')[0];
                    const presentCount = session.students?.filter(
                      s => s.attendance[today]?.status === 'present'
                    ).length || 0;
                    const absentCount = session.students?.filter(
                      s => s.attendance[today]?.status === 'absent'
                    ).length || 0;
  
                    return (
                      <tr
                        key={session.id}
                        className={`border-b hover:bg-gray-50 cursor-pointer ${selectedSession?.id === session.id ? 'bg-blue-50' : ''}`}
                        onClick={() => setSelectedSession(session)}
                      >
                        <td className="p-3 font-medium">{session.course} ({session.courseCode})</td>
                        <td className="p-3">{session.level}</td>
                        <td className="p-3">{session?.sessionName}</td>
                        <td className="p-3">
                          {formatDate(session.date)}
                          <br />
                          <span className="text-xs text-gray-500">({getTimeAgo(session.date)})</span>
                        </td>
                        <td className="p-3">{session.semester}</td>
                        <td className=" p-3 text-green-600 ">
                          {/*<CheckCircle size={12} className="mr-" />*/} {presentCount}
                        </td>
                        <td className="p-3 text-red-600 ">
                          {/* <XCircle size={6} className="mr-" />*/} {absentCount}
                        </td>
                        <td className="p-3">
                          {session.isActive ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                              Inactive
                            </Badge>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => handleDeletePrompt(e, session.id)}
                          >
                            <Trash2 size={14} className="text-red-500" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the attendance session from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSession} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </> 
  );
};
