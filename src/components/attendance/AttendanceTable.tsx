
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileDown, CheckCircle, XCircle, Clock, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAttendanceStore, AttendanceSession } from '@/stores/useAttendanceStore';
import { useToast } from '@/hooks/use-toast';
import { attendanceService } from '@/services/api/attendanceService';

export const AttendanceTable = () => {
  const { selectedSession, markAttendance, setError } = useAttendanceStore();
  const { toast } = useToast();

  const handleMarkAttendance = async (studentId: string, status: 'present' | 'absent') => {
    if (!selectedSession) return;
    
    try {
      // Call the API to mark attendance
      await attendanceService.markAttendance(selectedSession.id, {
        studentId,
        status
      });
      
      // Update local state
      markAttendance(selectedSession.id, studentId, status);
      
      toast({
        title: "Attendance Marked",
        description: "Student attendance has been updated successfully.",
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

  return (
    <Card className="lg:col-span-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {`${selectedSession.course} (${selectedSession.courseCode}) - Level ${selectedSession.level}`}
        </CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <FileDown size={16} />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table className="border">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-12 text-center border-r">#</TableHead>
              <TableHead className="border-r">Student Name</TableHead>
              <TableHead className="border-r">Registration Number</TableHead>
              <TableHead>Attendance Status</TableHead>
              <TableHead className="w-[180px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedSession?.students?.map((student, index) => {
              const today = new Date().toISOString().split('T')[0];
              const attendanceToday = student.attendance[today] || { status: 'not-marked' };
              
              // Set background colors based on attendance status
              let bgColorClass = '';
              if (attendanceToday.status === 'present') {
                bgColorClass = 'bg-[#F2FCE2]'; // Soft green for present
              } else if (attendanceToday.status === 'absent') {
                bgColorClass = 'bg-[#ea384c]/10'; // Light red for absent
              }
              
              return (
                <TableRow key={student.id} className={`border-b ${bgColorClass}`}>
                  <TableCell className="text-center font-medium border-r">{index + 1}</TableCell>
                  <TableCell className="border-r">{student.name}</TableCell>
                  <TableCell className="border-r">{student.registrationNumber}</TableCell>
                  <TableCell>
                    {attendanceToday.status === 'present' ? (
                      <span className="flex items-center text-green-600">
                        <CheckCircle size={16} className="mr-1" />
                        Present {attendanceToday.time && `at ${attendanceToday.time}`}
                      </span>
                    ) : attendanceToday.status === 'absent' ? (
                      <span className="flex items-center text-[#ea384c]">
                        <XCircle size={16} className="mr-1" />
                        Absent
                      </span>
                    ) : (
                      <span className="flex items-center text-gray-500">
                        <Clock size={16} className="mr-1" />
                        Not Marked
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {selectedSession.isActive && (
                      <div className="flex space-x-1">
                        <Button 
                          size="sm" 
                          className="h-8 px-2 bg-green-500 hover:bg-green-600 text-white"
                          onClick={() => handleMarkAttendance(student.id, 'present')}
                          disabled={attendanceToday.status === 'present'}
                        >
                          Present
                        </Button>
                        <Button 
                          size="sm" 
                          className="h-8 px-2 bg-[#ea384c] hover:bg-[#d1293d] text-white"
                          onClick={() => handleMarkAttendance(student.id, 'absent')}
                          disabled={attendanceToday.status === 'absent'}
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
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
          <PlusCircle size={16} />
          Add Attendance
        </Button>
      </CardFooter>
    </Card>
  );
};
