
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Play, FileDown, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ActivateAttendanceDialog } from '@/components/dashboard/ActivateAttendanceDialog';

type Student = {
  id: string;
  name: string;
  registrationNumber: string;
  attendance: {
    [date: string]: {
      status: 'present' | 'absent' | 'not-marked';
      time?: string;
    }
  }
};

type AttendanceSession = {
  id: string;
  date: string;
  course: string;
  level: string;
  sessionName: string;
  isActive: boolean;
  students: Student[];
};

const initialAttendanceSessions: AttendanceSession[] = [
  {
    id: '1',
    date: '2024-04-12',
    course: 'Introduction to Computer Science (CSC101)',
    level: '100',
    sessionName: '2024/2025',
    isActive: true,
    students: [
      {
        id: '1',
        name: 'John Doe',
        registrationNumber: '2024/001',
        attendance: {
          '2024-04-10': { status: 'present', time: '09:00 AM' },
          '2024-04-11': { status: 'present', time: '09:05 AM' },
          '2024-04-12': { status: 'not-marked' }
        }
      },
      {
        id: '2',
        name: 'Jane Smith',
        registrationNumber: '2024/002',
        attendance: {
          '2024-04-10': { status: 'present', time: '09:10 AM' },
          '2024-04-11': { status: 'absent' },
          '2024-04-12': { status: 'not-marked' }
        }
      }
    ]
  },
  {
    id: '2',
    date: '2024-04-11',
    course: 'Data Structures and Algorithms (CSC201)',
    level: '200',
    sessionName: '2024/2025',
    isActive: false,
    students: [
      {
        id: '1',
        name: 'John Doe',
        registrationNumber: '2024/001',
        attendance: {
          '2024-04-11': { status: 'present', time: '10:00 AM' }
        }
      },
      {
        id: '3',
        name: 'Michael Johnson',
        registrationNumber: '2024/003',
        attendance: {
          '2024-04-11': { status: 'absent' }
        }
      }
    ]
  }
];

// Sample data for the dialogs
const courses = [
  { id: '1', name: 'Introduction to Computer Science (CSC101)' },
  { id: '2', name: 'Data Structures and Algorithms (CSC201)' },
  { id: '3', name: 'Advanced Calculus (MTH301)' },
  { id: '4', name: 'Introduction to Physics (PHY101)' },
  { id: '5', name: 'Organic Chemistry (CHM202)' }
];

const sessions = [
  { id: '1', name: '2023/2024' },
  { id: '2', name: '2024/2025' },
  { id: '3', name: '2022/2023' }
];

export default function Attendance() {
  const [attendanceSessions, setAttendanceSessions] = useState<AttendanceSession[]>(initialAttendanceSessions);
  const [selectedSession, setSelectedSession] = useState<AttendanceSession | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isActivateAttendanceOpen, setIsActivateAttendanceOpen] = useState(false);
  const { toast } = useToast();

  const filteredSessions = attendanceSessions.filter(session => 
    session.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.level.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.sessionName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleActivateAttendance = (data: any) => {
    const today = new Date().toISOString().split('T')[0];
    
    const newSession: AttendanceSession = {
      id: `${attendanceSessions.length + 1}`,
      date: today,
      course: courses.find(c => c.id === data.courseId)?.name || '',
      level: data.level,
      sessionName: sessions.find(s => s.id === data.sessionId)?.name || '',
      isActive: true,
      students: initialAttendanceSessions[0].students.map(student => ({
        ...student,
        attendance: {
          ...student.attendance,
          [today]: { status: 'not-marked' }
        }
      }))
    };
    
    setAttendanceSessions([newSession, ...attendanceSessions]);
    setSelectedSession(newSession);
    
    toast({
      title: "Attendance Activated",
      description: "Attendance session has been activated successfully.",
    });
  };

  const handleMarkAttendance = (studentId: string, status: 'present' | 'absent') => {
    if (!selectedSession) return;
    
    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
    
    const updatedSessions = attendanceSessions.map(session => {
      if (session.id === selectedSession.id) {
        return {
          ...session,
          students: session.students.map(student => {
            if (student.id === studentId) {
              return {
                ...student,
                attendance: {
                  ...student.attendance,
                  [today]: { 
                    status, 
                    time: status === 'present' ? currentTime : undefined 
                  }
                }
              };
            }
            return student;
          })
        };
      }
      return session;
    });
    
    setAttendanceSessions(updatedSessions);
    setSelectedSession(updatedSessions.find(s => s.id === selectedSession.id) || null);
    
    toast({
      title: "Attendance Marked",
      description: `Student marked as ${status}.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Attendance</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search attendance"
              className="pl-8 w-[200px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter size={16} />
            Filter
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 gap-2"
            onClick={() => setIsActivateAttendanceOpen(true)}
          >
            <Play size={16} />
            Activate Attendance
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Attendance Sessions List */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Attendance Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredSessions.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No attendance sessions found.</p>
              ) : (
                filteredSessions.map((session) => (
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

        {/* Attendance Marking Table */}
        <Card className="lg:col-span-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              {selectedSession 
                ? `${selectedSession.course} - Level ${selectedSession.level}`
                : "Select an Attendance Session"
              }
            </CardTitle>
            {selectedSession && (
              <Button variant="outline" className="gap-2">
                <FileDown size={16} />
                Export
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {!selectedSession ? (
              <div className="text-center py-10">
                <Clock className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No session selected</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select an attendance session from the list to view and mark attendance.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Registration Number</TableHead>
                    <TableHead>Attendance Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedSession.students.map((student) => {
                    const today = new Date().toISOString().split('T')[0];
                    const attendanceToday = student.attendance[today] || { status: 'not-marked' };
                    
                    return (
                      <TableRow key={student.id}>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.registrationNumber}</TableCell>
                        <TableCell>
                          {attendanceToday.status === 'present' ? (
                            <span className="flex items-center text-green-600">
                              <CheckCircle size={16} className="mr-1" />
                              Present {attendanceToday.time && `at ${attendanceToday.time}`}
                            </span>
                          ) : attendanceToday.status === 'absent' ? (
                            <span className="flex items-center text-red-600">
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
                                variant="outline" 
                                className="h-8 px-2 text-green-600 border-green-300 hover:bg-green-50 hover:text-green-700"
                                onClick={() => handleMarkAttendance(student.id, 'present')}
                                disabled={attendanceToday.status === 'present'}
                              >
                                Present
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 px-2 text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
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
            )}
          </CardContent>
        </Card>
      </div>

      <ActivateAttendanceDialog 
        open={isActivateAttendanceOpen}
        onOpenChange={setIsActivateAttendanceOpen}
        onAttendanceActivated={handleActivateAttendance}
        courses={courses}
        sessions={sessions}
      />
    </DashboardLayout>
  );
}
