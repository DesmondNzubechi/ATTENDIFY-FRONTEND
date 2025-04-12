
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Play, FileDown, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
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
import { FilterModal, FilterOption } from '@/components/dashboard/FilterModal';
import { attendanceService, AttendanceSession } from '@/services/api/attendanceService';

export default function Attendance() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSession, setSelectedSession] = useState<AttendanceSession | null>(null);
  const [isActivateAttendanceOpen, setIsActivateAttendanceOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Setup filter options
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([
    { id: 'level-100', label: 'Level 100', checked: false, group: 'Level' },
    { id: 'level-200', label: 'Level 200', checked: false, group: 'Level' },
    { id: 'level-300', label: 'Level 300', checked: false, group: 'Level' },
    { id: 'level-400', label: 'Level 400', checked: false, group: 'Level' },
    { id: 'session-current', label: 'Current Session', checked: false, group: 'Session' },
    { id: 'session-past', label: 'Past Sessions', checked: false, group: 'Session' },
    { id: 'status-active', label: 'Active Sessions', checked: false, group: 'Status' },
    { id: 'status-inactive', label: 'Inactive Sessions', checked: false, group: 'Status' },
  ]);

  // Fetch attendance sessions
  const { data: attendanceSessions = [], isLoading } = useQuery({
    queryKey: ['attendanceSessions'],
    queryFn: attendanceService.getAllAttendance,
  });

  // Mark attendance mutation
  const markAttendanceMutation = useMutation({
    mutationFn: ({ attendanceId, data }: { attendanceId: string; data: any }) => 
      attendanceService.markAttendance(attendanceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendanceSessions'] });
      toast({
        title: "Attendance Marked",
        description: "Student attendance has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to mark attendance",
        variant: "destructive",
      });
    }
  });

  // Activate attendance mutation
  const activateAttendanceMutation = useMutation({
    mutationFn: attendanceService.createAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendanceSessions'] });
      toast({
        title: "Attendance Activated",
        description: "Attendance session has been activated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to activate attendance",
        variant: "destructive",
      });
    }
  });

  const handleActivateAttendance = (data: any) => {
    activateAttendanceMutation.mutate(data);
  };

  const handleMarkAttendance = (studentId: string, status: 'present' | 'absent') => {
    if (!selectedSession) return;
    
    const data = {
      studentId,
      status,
      date: new Date().toISOString().split('T')[0],
    };
    
    markAttendanceMutation.mutate({ 
      attendanceId: selectedSession.id, 
      data
    });
  };

  const handleApplyFilters = (updatedFilters: FilterOption[]) => {
    setFilterOptions(updatedFilters);
  };

  // Filter attendance sessions based on search query and filter options
  const filteredSessions = React.useMemo(() => {
    const activatedFilters = filterOptions.filter(filter => filter.checked);
    
    return attendanceSessions.filter((session: AttendanceSession) => {
      // Apply text search
      const matchesSearch = session.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          session.level.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          session.sessionName.toLowerCase().includes(searchQuery.toLowerCase());
      
      // If no filters are activated, just use text search
      if (activatedFilters.length === 0) {
        return matchesSearch;
      }
      
      // Apply filters
      const matchesFilters = activatedFilters.some(filter => {
        if (filter.group === 'Level') {
          return session.level === filter.label.split(' ')[1];
        }
        if (filter.group === 'Status') {
          return (filter.id === 'status-active' && session.isActive) ||
                 (filter.id === 'status-inactive' && !session.isActive);
        }
        return true;
      });
      
      return matchesSearch && matchesFilters;
    });
  }, [attendanceSessions, searchQuery, filterOptions]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[70vh]">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        </div>
      </DashboardLayout>
    );
  }

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
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setIsFilterOpen(true)}
          >
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
                filteredSessions.map((session: AttendanceSession) => (
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
                  {selectedSession.students.map((student, index) => {
                    const today = new Date().toISOString().split('T')[0];
                    const attendanceToday = student.attendance[today] || { status: 'not-marked' };
                    
                    return (
                      <TableRow key={student.id} className="border-b">
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
                                className="h-8 px-2 bg-green-500 hover:bg-green-600 text-white"
                                onClick={() => handleMarkAttendance(student.id, 'present')}
                                disabled={attendanceToday.status === 'present' || markAttendanceMutation.isPending}
                              >
                                Present
                              </Button>
                              <Button 
                                size="sm" 
                                className="h-8 px-2 bg-red-500 hover:bg-red-600 text-white"
                                onClick={() => handleMarkAttendance(student.id, 'absent')}
                                disabled={attendanceToday.status === 'absent' || markAttendanceMutation.isPending}
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
        courses={[
          { id: '1', name: 'Introduction to Computer Science (CSC101)' },
          { id: '2', name: 'Data Structures and Algorithms (CSC201)' },
          { id: '3', name: 'Advanced Calculus (MTH301)' },
          { id: '4', name: 'Introduction to Physics (PHY101)' },
          { id: '5', name: 'Organic Chemistry (CHM202)' }
        ]}
        sessions={[
          { id: '1', name: '2023/2024' },
          { id: '2', name: '2024/2025' },
          { id: '3', name: '2022/2023' }
        ]}
      />

      <FilterModal 
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        options={filterOptions}
        onApplyFilters={handleApplyFilters}
        groups={['Level', 'Session', 'Status']}
      />
    </DashboardLayout>
  );
}
