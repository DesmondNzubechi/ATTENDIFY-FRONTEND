
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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 

export const AttendanceTable = () => {
  const { selectedSession, markAttendance, setError, updateSession, activateSession, deactivateSession } = useAttendanceStore();
  const { toast } = useToast();
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
 // Create export options menu
 const [showExportOptions, setShowExportOptions] = useState<boolean>(false);
 
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
 
  // Function to export attendance as PDF
  const exportToPDF = () => {
    if (!selectedSession) return;

    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text('FACULTY OF ENGINEERING', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
    doc.setFontSize(14);
    doc.text('DEPARTMENT OF ELECTRICAL ENGINEERING ATTENDANCE SHEET', doc.internal.pageSize.getWidth() / 2, 22, { align: 'center' });
    
    // Add course details
    doc.setFontSize(10);
    doc.text(`COURSE CODE: ${selectedSession.courseCode}    COURSE TITLE: ${selectedSession.course}    LEVEL: ${selectedSession.level}`, doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });
    doc.text(`SEMESTER: ${selectedSession.semester}    SESSION: ${selectedSession.sessionName}`, doc.internal.pageSize.getWidth() / 2, 35, { align: 'center' });
    
    // Generate columns for attendance dates
    const attendanceDates = generateAttendanceColumns();
    
    // Prepare table headers
    const tableHeaders = [
      ['#', 'Student Name', 'Registration Number', ...attendanceDates.map(date => new Date(date).toLocaleDateString())],
    ];
    
    // Prepare table data
    const tableData = selectedSession.students.map((student, index) => {
      const row = [
        (index + 1).toString(),
        student.name,
        student.registrationNumber
      ];
      
      // Add attendance status for each date
      attendanceDates.forEach(date => {
        const attendanceForDate = student.attendance[date];
        if (attendanceForDate) {
          row.push(attendanceForDate.status === 'present' ? 'Present' : 'Absent');
        } else {
          row.push('');
        }
      });
      
      return row;
    }); 
    
    // Create table
    autoTable(doc, {
      head: tableHeaders,
      body: tableData,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 1 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      didDrawCell: (data) => {
        // Color cells based on attendance status
        if (data.section === 'body' && data.column.index >= 3) {
          const cellValue = data.cell.text[0];
          if (cellValue === 'Present') {
            data.cell.styles.fillColor = [232, 255, 232];
          } else if (cellValue === 'Absent') {
            data.cell.styles.fillColor = [255, 232, 232];
          }
        }
      }
    });
    
    // Save the PDF
    doc.save(`${selectedSession.courseCode}_Attendance_${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast({
      title: "Export Successful",
      description: "Attendance sheet has been exported as PDF.",
    });
  };

  // Function to export attendance as DOCX
  const exportToWord = () => {
    if (!selectedSession) return;
    
    // Create a blob of HTML that will be converted to Word format
    const attendanceDates = generateAttendanceColumns();
    
    let tableHTML = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Attendance Sheet</title>
        <style>
          table {border-collapse: collapse; width: 100%;}
          th, td {border: 1px solid #ddd; padding: 8px; text-align: left;}
          th {background-color: #f2f2f2;}
          .present {background-color: #e8ffe8;}
          .absent {background-color: #ffe8e8;}
          h1, h2, h3 {text-align: center;}
        </style>
      </head>
      <body>
        <h1>FACULTY OF ENGINEERING</h1>
        <h2>DEPARTMENT OF ELECTRICAL ENGINEERING ATTENDANCE SHEET</h2>
        <h3>COURSE CODE: ${selectedSession.courseCode} | COURSE TITLE: ${selectedSession.course} | LEVEL: ${selectedSession.level}</h3>
        <h3>SEMESTER: ${selectedSession.semester} | SESSION: ${selectedSession.sessionName}</h3>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Student Name</th>
              <th>Registration Number</th>
              ${attendanceDates.map(date => `<th>${new Date(date).toLocaleDateString()}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
    `;
    
    selectedSession.students.forEach((student, index) => {
      tableHTML += `<tr>
        <td>${index + 1}</td>
        <td>${student.name}</td>
        <td>${student.registrationNumber}</td>
      `;
      
      attendanceDates.forEach(date => {
        const attendanceForDate = student.attendance[date];
        if (attendanceForDate) {
          if (attendanceForDate.status === 'present') {
            tableHTML += `<td class="present">Present</td>`;
          } else {
            tableHTML += `<td class="absent">Absent</td>`;
          }
        } else {
          tableHTML += `<td></td>`;
        }
      });
      
      tableHTML += `</tr>`;
    });
    
    tableHTML += `
          </tbody>
        </table>
      </body>
      </html>
    `;
    
    // Create a Blob and download link
    const blob = new Blob([tableHTML], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${selectedSession.courseCode}_Attendance_${new Date().toISOString().split('T')[0]}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: "Attendance sheet has been exported as Word document.",
    });
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
    return Array.from({ length: 10 }, (_, index) => {
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
              <p><span className="font-medium">Session:</span> {selectedSession?.sessionName}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="border">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-12 text-center border-r">S/N</TableHead>
                  <TableHead className="border-r uppercase">Student Name</TableHead>
                  <TableHead className="border-r uppercase">Registration Number</TableHead>
                  {attendanceDates.map((date, index) => (
                    <TableHead key={date} className="border-r text-center">
                      {/* {new Date(date).toLocaleDateString()} */}SIGN
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
                      <TableCell className="border-r capitalize ">{student.name}</TableCell>
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
                              <span className="flex   text-green-600">
                                <CheckCircle size={12} className="mr-1 mt-2" />
                                <div className='flex flex-col'>
                                Present
                                <span className='text-[8px] self-col '>
                                {attendanceForDate.time}
                              </span>
                                </div>
                            
                              </span>
                            );
                          } else if (attendanceForDate.status === 'absent') {
                            bgColorClass = 'bg-[#ea384c]/10'; // Light red for absent
                            statusDisplay = (
                              <span className="flex items-cente justify-center text-[#ea384c]">
                                <XCircle size={12} className="mr-1 mt-2 " />
                                <div className='flex flex-col'>
                                Absent
                                <span className='text-[8px] self-col '>
                                {attendanceForDate.time}
                              </span>
                                </div>
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
          <div className="relative">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => setShowExportOptions(!showExportOptions)}
            >
              <FileDown size={16} />
              Export
            </Button>
            {showExportOptions && (
              <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <button
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      exportToPDF();
                      setShowExportOptions(false);
                    }}
                  >
                    Export as PDF
                  </button>
                  <button
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      exportToWord();
                      setShowExportOptions(false);
                    }}
                  >
                    Export as Word
                  </button>
                </div>
              </div>
            )}
          </div>
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
