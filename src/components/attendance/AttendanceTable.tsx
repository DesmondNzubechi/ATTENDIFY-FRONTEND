
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FileDown, CheckCircle, XCircle, Clock, Power } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAttendanceStore } from '@/stores/useAttendanceStore';
import { useToast } from '@/hooks/use-toast';
import { attendanceService } from '@/services/api/attendanceService';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export const AttendanceTable = () => {
  const { selectedSession, markAttendance, setError, updateSession, activateSession, deactivateSession } = useAttendanceStore();
  const { toast } = useToast();
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

  const handleMarkAttendance = async (studentId: string, status: 'present' | 'absent') => {
    if (!selectedSession) return;
    
    try {
      // Call the API to mark attendance
      await attendanceService.markAttendance(selectedSession.id, {
        studentId,
        status,
        level: selectedSession.level,
        regNo: selectedSession.students.find(s => s.id === studentId)?.registrationNumber
      });
      
      // Update local state
      markAttendance(selectedSession.id, studentId, status);
      
      toast({
        title: "Attendance Marked",
        description: `Student attendance has been marked as ${status}.`,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to mark attendance');
      toast({
        title: "Error",
        description: "Failed to mark attendance. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleToggleSessionStatusPrompt = () => {
    setIsStatusDialogOpen(true);
  };

  const handleToggleSessionStatus = async () => {
    if (!selectedSession) return;
    
    try {
      if (selectedSession.isActive) {
        // Deactivate the session
        await deactivateSession(selectedSession.id);
        toast({
          title: "Session Deactivated",
          description: "Attendance session has been deactivated.",
        });
      } else {
        // Activate the session
        await activateSession(selectedSession.id);
        toast({
          title: "Session Activated",
          description: "Attendance session has been activated.",
        });
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update session status');
      toast({
        title: "Error",
        description: "Failed to update session status. Please try again.",
        variant: "destructive"
      });
    }
    setIsStatusDialogOpen(false);
  };

  if (!selectedSession) {
    return (
      <Card className="lg:col-span-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Select an Attendance Session</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10">
            <Clock className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No session selected</h3>
            <p className="mt-1 text-sm text-gray-500">
              Select an attendance session from the list to view and mark attendance.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Generate columns for 10 attendance sessions
  const generateAttendanceColumns = () => {
    // Create an array of 10 dates, starting from today and going backward
    const today = new Date();
    return Array.from({ length: 6 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - index);
      return date.toISOString().split('T')[0];
    });
  };

  const attendanceDates = generateAttendanceColumns();

  return (
    <>
      <Card className="lg:col-span-8">
        <CardHeader className="flex flex-col">
          <div className="text-center mb-4 flex flex-col justify-center items-center">
            <h2 className="text-xl font-bold">FACULTY OF ENGINEERING</h2>
            <h3 className="text-lg uppercase font-semibold">Department of Electrical Engineering Attendance Sheet</h3>
            <div className="mt-2 flex flex-wrap uppercase items-center gap-2 justify-center">
              <p><span className="font-medium">Course Code:</span> {selectedSession.courseCode}</p>
              <p><span className="font-medium">Course Title:</span> {selectedSession.course}</p>
              <p><span className="font-medium">Level:</span> {selectedSession.level}</p>
              <p><span className="font-medium">Semester:</span> {selectedSession.semester}</p>
              <p><span className="font-medium">Session:</span> {selectedSession.sessionName}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="border">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-12 text-center border-r">#</TableHead>
                  <TableHead className="border-r">Student Name</TableHead>
                  <TableHead className="border-r">Registration Number</TableHead>
                  {attendanceDates.map((date, index) => (
                    <TableHead key={date} className="border-r text-center">
                      {new Date(date).toLocaleDateString()}
                    </TableHead>
                  ))}
                  <TableHead className="w-[180px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedSession?.students?.map((student, index) => {
                  return (
                    <TableRow key={student.id} className="border-b">
                      <TableCell className="text-center font-medium border-r">{index + 1}</TableCell>
                      <TableCell className="border-r">{student.name}</TableCell>
                      <TableCell className="border-r">{student.registrationNumber}</TableCell>
                      
                      {/* Generate 10 attendance cells */}
                      {attendanceDates.map(date => {
                        const attendanceForDate = student.attendance[date];
                        
                        // Set background colors based on attendance status
                        let bgColorClass = 'bg-white';
                        let statusDisplay = null;
                        
                        if (attendanceForDate) {
                          if (attendanceForDate.status === 'present') {
                            bgColorClass = 'bg-[#F2FCE2]'; // Soft green for present
                            statusDisplay = (
                              <span className="flex items-center justify-center text-green-600">
                                <CheckCircle size={12} className="mr-1" />
                                Present
                              </span>
                            );
                          } else if (attendanceForDate.status === 'absent') {
                            bgColorClass = 'bg-[#ea384c]/10'; // Light red for absent
                            statusDisplay = (
                              <span className="flex items-center justify-center text-[#ea384c]">
                                <XCircle size={12} className="mr-1" />
                                Absent
                              </span>
                            );
                          }
                        }
                        
                        return (
                          <TableCell key={date} className={`border-r text-center ${bgColorClass}`}>
                            {statusDisplay}
                          </TableCell>
                        );
                      })}
                      
                      <TableCell>
                        {selectedSession.isActive && (
                          <div className="flex space-x-1">
                            <Button 
                              size="sm" 
                              className="h-8 px-2 bg-green-500 hover:bg-green-600 text-white"
                              onClick={() => handleMarkAttendance(student.id, 'present')}
                            >
                              Present
                            </Button>
                            <Button 
                              size="sm" 
                              className="h-8 px-2 bg-[#ea384c] hover:bg-[#d1293d] text-white"
                              onClick={() => handleMarkAttendance(student.id, 'absent')}
                            >
                              Absent
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex p-3 justify-between items-center">
          <Button variant="outline" className="gap-2">
            <FileDown size={16} />
            Export
          </Button>
          <Button 
            onClick={handleToggleSessionStatusPrompt}
            variant={selectedSession.isActive ? "destructive" : "default"}
            className="gap-2"
          >
            <Power size={16} />
            {selectedSession.isActive ? "Deactivate" : "Activate"}
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedSession.isActive
                ? "Are you sure you want to deactivate this attendance session? Students will no longer be able to mark their attendance."
                : "Are you sure you want to activate this attendance session? This will allow students to mark their attendance."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleToggleSessionStatus} 
              className={selectedSession.isActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
            >
              {selectedSession.isActive ? "Deactivate" : "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
