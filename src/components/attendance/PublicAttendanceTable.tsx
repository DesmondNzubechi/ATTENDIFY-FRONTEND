import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FileDown,
  CheckCircle,
  XCircle,
  Clock,
  Power,
  Trash2,
  UserPlus,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAttendanceStore } from "@/stores/useAttendanceStore";
import { useToast } from "@/hooks/use-toast";
import { attendanceService } from "@/services/api/attendanceService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { AddStudentDialog } from "../dashboard/AddStudentDialog";
import { addStudentData } from "@/services/api/studentsService";
import { isToday } from "date-fns";
import Navbar from "../Navbar";

export const PublicAttendanceTable = () => {
  const {
    selectedSession,
    setSelectedSession,
    markAttendance,
    setError,
    updateSession,
    deleteSession,
    activateSession,
    deactivateSession,
  } = useAttendanceStore();
  const { toast } = useToast();
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  // Create export options menu
  const [showExportOptions, setShowExportOptions] = useState<boolean>(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleMarkAttendance = async (
    studentId: string,
    status: "present" | "absent"
  ) => {
    if (!selectedSession) return;

    try {
      // Call the API to mark attendance
      if (status === "present") {
        await attendanceService.markAttendance(selectedSession.id, {
          level: selectedSession.level,
          regNo: selectedSession.students.find((s) => s.id === studentId)
            ?.registrationNumber,
        });
      }

      if (status === "absent") {
        await attendanceService.markAbsent(selectedSession.id, {
          level: selectedSession.level,
          regNo: selectedSession.students.find((s) => s.id === studentId)
            ?.registrationNumber,
        });
      }

      // Update local state
      markAttendance(selectedSession.id, studentId, status);

      toast({
        title: "Attendance Marked",
        description: `Student attendance has been marked as ${status}.`,
      });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to mark attendance"
      );
      toast({
        title: "Error",
        description: "Failed to mark attendance. Please try again.",
        variant: "destructive",
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
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update session status"
      );
      toast({
        title: "Error",
        description: "Failed to update session status. Please try again.",
        variant: "destructive",
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
    doc.text(
      "FACULTY OF ENGINEERING",
      doc.internal.pageSize.getWidth() / 2,
      15,
      { align: "center" }
    );
    doc.setFontSize(14);
    doc.text(
      "DEPARTMENT OF ELECTRICAL ENGINEERING ATTENDANCE SHEET",
      doc.internal.pageSize.getWidth() / 2,
      22,
      { align: "center" }
    );

    // Add course details
    doc.setFontSize(10);
    doc.text(
      `COURSE CODE: ${selectedSession.courseCode}    COURSE TITLE: ${selectedSession.course}    LEVEL: ${selectedSession.level}`,
      doc.internal.pageSize.getWidth() / 2,
      30,
      { align: "center" }
    );
    doc.text(
      `SEMESTER: ${selectedSession.semester}    SESSION: ${selectedSession.sessionName}`,
      doc.internal.pageSize.getWidth() / 2,
      35,
      { align: "center" }
    );

    // Generate columns for attendance dates
    const attendanceDates = generateAttendanceColumns();

    // Prepare table headers
    const tableHeaders = [
      [
        "#",
        "Student Name",
        "Registration Number",
        ...attendanceDates.map((date) => new Date(date).toLocaleDateString()),
      ],
    ];

    // Prepare table data
    const tableData = selectedSession.students.map((student, index) => {
      const row = [
        (index + 1).toString(),
        student.name,
        student.registrationNumber,
      ];

      // Add attendance status for each date
      attendanceDates.forEach((date) => {
        const attendanceForDate = student.attendance[date];
        if (attendanceForDate) {
          row.push(
            attendanceForDate.status === "present" ? "Present" : "Absent"
          );
        } else {
          row.push("");
        }
      });

      return row;
    });

    // Create table
    autoTable(doc, {
      head: tableHeaders,
      body: tableData,
      startY: 40,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 1 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      didDrawCell: (data) => {
        // Color cells based on attendance status
        if (data.section === "body" && data.column.index >= 3) {
          const cellValue = data.cell.text[0];
          if (cellValue === "Present") {
            data.cell.styles.fillColor = [232, 255, 232];
          } else if (cellValue === "Absent") {
            data.cell.styles.fillColor = [255, 232, 232];
          }
        }
      },
    });

    // Save the PDF
    doc.save(
      `${selectedSession.courseCode}_Attendance_${
        new Date().toISOString().split("T")[0]
      }.pdf`
    );

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
        <h3>COURSE CODE: ${selectedSession.courseCode.toUpperCase()} | COURSE TITLE: ${selectedSession.course.toUpperCase()} | LEVEL: ${selectedSession.level.toUpperCase()}</h3>
        <h3>SEMESTER: ${selectedSession.semester.toUpperCase()} | SESSION: ${selectedSession.sessionName.toUpperCase()}</h3>
        <table>
          <thead>
            <tr>
              <th>S/N</th>
              <th>STUDENT NAME</th>
              <th>REGISTRATION NUMBER</th>
              ${attendanceDates
                .map(
                  (date) => `<th>${new Date(date).toLocaleDateString()}</th>`
                )
                .join("")}
              <br>
              SIGN
            </tr>
            <tr>PERCENTAGE<tr>
          </thead>
          <tbody>
    `;

    selectedSession.students.forEach((student, index) => {
      tableHTML += `<tr>
        <td>${index + 1}</td>
        <td>${student.name}</td>
        <td>${student.registrationNumber}</td>
      `;

      attendanceDates.forEach((date) => {
        const attendanceForDate = student.attendance[date];
        if (attendanceForDate) {
          if (attendanceForDate.status === "present") {
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
    const blob = new Blob([tableHTML], { type: "application/msword" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${selectedSession.courseCode}_Attendance_${
      new Date().toISOString().split("T")[0]
    }.doc`;
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No session selected
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Select an attendance session from the list to view and mark
              attendance.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }


  const generateAttendanceColumns = () => {
    if (!selectedSession) return [];

    const allDatesSet = new Set<string>();

    // Gather all unique attendance dates
    selectedSession.students.forEach((student) => {
      Object.keys(student.attendance || {}).forEach((date) => {
        allDatesSet.add(date);
      });
    });

    // Sort the unique attendance dates
    const sortedDates = Array.from(allDatesSet).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    // If we already have 6 or more dates, return the first 6
    if (sortedDates.length >= 6) {
      return sortedDates.slice(0, 6);
    }

    // Fill in future dates to make up 6 columns
    const extraDates = [];
    const countToAdd = 6 - sortedDates.length;

    let baseDate =
      sortedDates.length > 0
        ? new Date(sortedDates[sortedDates.length - 1])
        : new Date();

    for (let i = 1; i <= countToAdd; i++) {
      const futureDate = new Date(baseDate);
      futureDate.setDate(futureDate.getDate() + i);
      extraDates.push(futureDate.toISOString().split("T")[0]);
    }

    return [...sortedDates, ...extraDates];
  };

  const attendanceDates = generateAttendanceColumns();



  return (
      <>
      <Card className="lg:col-span-8">
        <CardHeader className="flex flex-col">
          <div className="text-center mb-4 flex flex-col justify-center items-center">
            <h2 className="text-xl md:text-[25px] text-[15px] font-bold">
              FACULTY OF ENGINEERING
            </h2>
            <h3 className="text-lg uppercase md:text-[20px] text-[11px] font-semibold">
              Department of Electrical Engineering Attendance Sheet
            </h3>
            <div className="mt-2 flex flex-wrap uppercase items-center gap-1 md:gap-2 justify-center">
              <p className="md:text-[15px] text-[10px]">
                <span className="font-medium ">Course Code:</span>{" "}
                {selectedSession.courseCode}
              </p>
              <p className="md:text-[15px] text-[10px]">
                <span className="font-medium">Course Title:</span>{" "}
                {selectedSession.course}
              </p>
              <p className="md:text-[15px] text-[10px]">
                <span className="font-medium">Level:</span>{" "}
                {selectedSession.level}
              </p>
              <p className="md:text-[15px] text-[10px]">
                <span className="font-medium">Semester:</span>{" "}
                {selectedSession.semester}
              </p>
              <p className="md:text-[15px] text-[10px]">
                <span className="font-medium">Session:</span>{" "}
                {selectedSession?.sessionName}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="border">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-12 text-center md:text-[20px] text-[10px] border-r">
                    S/N
                  </TableHead>
                  <TableHead className="border-r uppercase md:text-[12px] text-[7px]">
                    Student Name
                  </TableHead>
                  <TableHead className="border-r md:text-[12px] text-[7px] uppercase">
                    Registration Number
                  </TableHead>
                  {attendanceDates.map((date, index) => (
                    <TableHead
                      key={date}
                      className="border-r md:text-[12px] text-[7px] text-center"
                    >
                      {/* {new Date(date).toLocaleDateString()} */}SIGN
                    </TableHead>
                  ))}
                  <TableHead className="border-r md:text-[12px] text-[7px] text-center">
                    PERCENTAGE
                  </TableHead>
                 
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedSession?.students?.map((student, index) => {
                  return (
                    <TableRow key={student.id} className="border-b">
                      <TableCell className="text-center font-medium border-r">
                        {index + 1}
                      </TableCell>
                      <TableCell className="border-r  capitalize ">
                        {student.name}
                      </TableCell>
                      <TableCell className="border-r">
                        {student.registrationNumber}
                      </TableCell>

                      {/* Generate 10 attendance cells */}
                      {attendanceDates.map((date) => {
                        const attendanceForDate = student.attendance[date];

                        // Set background colors based on attendance status
                        let bgColorClass = "bg-white";
                        let statusDisplay = null;

                        if (attendanceForDate) {
                          if (attendanceForDate.status === "present") {
                            bgColorClass = "bg-[#F2FCE2]"; // Soft green for present
                            statusDisplay = (
                              <span className="flex   text-green-600">
                                <CheckCircle size={12} className="mr-1 mt-2" />
                                <div className="flex flex-col">
                                  Present
                                  <span className="text-[8px] self-col ">
                                    {attendanceForDate.time}
                                  </span>
                                </div>
                              </span>
                            );
                          } else if (attendanceForDate.status === "absent") {
                            bgColorClass = "bg-[#ea384c]/10"; // Light red for absent
                            statusDisplay = (
                              <span className="flex items-cente justify-center text-[#ea384c]">
                                <XCircle size={12} className="mr-1 mt-2 " />
                                <div className="flex flex-col">
                                  Absent
                                  <span className="text-[8px] self-col ">
                                    {attendanceForDate.time}
                                  </span>
                                </div>
                              </span>
                            );
                          }
                        }

                        return (
                          <TableCell
                            key={date}
                            className={`border-r text-center ${bgColorClass}`}
                          >
                            {statusDisplay}
                          </TableCell>
                        );
                      })}

                      <TableCell className="border-r text-center">
                        {(() => {
                          const totalMarked = attendanceDates.length;
                          const totalPresent = attendanceDates.reduce(
                            (count, date) => {
                              return student.attendance[date]?.status ===
                                "present"
                                ? count + 1
                                : count;
                            },
                            0
                          );

                          const percentage =
                            totalMarked > 0
                              ? ((totalPresent / totalMarked) * 100).toFixed(1)
                              : "0.0";
                          return `${percentage}%`;
                        })()}
                      </TableCell>
                 
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex p-3 justify-between flex-row w-full   gap-5 items-center">
          <div className="relative flex w-full md:w-fit gap-2">
            <Button
              variant="outline"
              className="gap-2 w-full md:w-fit"
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
       
        </CardFooter>
      </Card>

      

     
    </>
  );
};
