
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle } from 'lucide-react';
import { ActivateAttendanceDialog } from '@/components/dashboard/ActivateAttendanceDialog';
import { FilterModal, FilterOption } from '@/components/dashboard/FilterModal';
import { useAttendanceStore } from '@/stores/useAttendanceStore';
import { SearchAndFilters } from '@/components/attendance/SearchAndFilters';
import { AttendanceSessionsList } from '@/components/attendance/AttendanceSessionsList';
import { AttendanceTable } from '@/components/attendance/AttendanceTable';
import { useCoursesStore } from '@/stores/useCoursesStore';
import { useAcademicSessionsStore } from '@/stores/useAcademicSessionsStore';
import { Button } from '@/components/ui/button';
import { attendanceService } from '@/services/api/attendanceService';

export default function Attendance() {
  const { toast } = useToast();
  const { 
    sessions, 
    isLoading, 
    error, 
    fetchAttendance, 
    addSession,
    setError
  } = useAttendanceStore();

  const { 
    courses, 
    fetchCourses,
    isLoading: coursesLoading 
  } = useCoursesStore();

  const { 
    sessions: academicSessions, 
    fetchSessions,
    isLoading: sessionsLoading 
  } = useAcademicSessionsStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isActivateAttendanceOpen, setIsActivateAttendanceOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Setup filter options
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([
    { id: 'level-100', label: 'Level 100', checked: false, group: 'Level' },
    { id: 'level-200', label: 'Level 200', checked: false, group: 'Level' },
    { id: 'level-300', label: 'Level 300', checked: false, group: 'Level' },
    { id: 'level-400', label: 'Level 400', checked: false, group: 'Level' },
    { id: 'semester-first', label: 'First Semester', checked: false, group: 'Semester' },
    { id: 'semester-second', label: 'Second Semester', checked: false, group: 'Semester' },
    { id: 'status-active', label: 'Active Sessions', checked: false, group: 'Status' },
    { id: 'status-inactive', label: 'Inactive Sessions', checked: false, group: 'Status' },
  ]);

  // Fetch attendance data on component mount
  useEffect(() => {
    fetchAttendance();
    fetchCourses();
    fetchSessions();
  }, [fetchAttendance, fetchCourses, fetchSessions]);

  const handleActivateAttendance = async (data: any) => {
    try {
      // Format the data for the API
      const attendanceData = {
        courseId: data.courseId,
        acedemicSessionId: data.sessionId,
        semester: data.semester || "first semester",
        level: data.level
      };

      // Call the API to create a new attendance session
      const response = await attendanceService.createAttendance(attendanceData);
      
      // Refresh the attendance data after creating a new session
      fetchAttendance();
      
      toast({
        title: "Attendance Activated",
        description: "Attendance session has been activated successfully.",
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to activate attendance');
      toast({
        title: "Error",
        description: "Failed to activate attendance. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleApplyFilters = (updatedFilters: FilterOption[]) => {
    setFilterOptions(updatedFilters);
  };

  // Filter attendance sessions based on search query and filter options
  const filteredSessions = React.useMemo(() => {
    const activatedFilters = filterOptions.filter(filter => filter.checked);
    
    return sessions.filter((session) => {
      // Apply text search
      const matchesSearch = 
        session.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
        if (filter.group === 'Semester') {
          const semester = filter.label.toLowerCase().includes('first') ? 'first semester' : 'second semester';
          return session.semester.toLowerCase() === semester;
        }
        if (filter.group === 'Status') {
          return (filter.id === 'status-active' && session.isActive) ||
                 (filter.id === 'status-inactive' && !session.isActive);
        }
        return true;
      });
      
      return matchesSearch && matchesFilters;
    });
  }, [sessions, searchQuery, filterOptions]);

  // Show loading state
  if (isLoading || coursesLoading || sessionsLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[70vh]">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          <span className="ml-2 text-blue-500">Loading attendance data...</span>
        </div>
      </DashboardLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col justify-center items-center h-[70vh]">
          <p className="text-red-500 mb-4">Error loading attendance data: {error}</p>
          <Button onClick={() => fetchAttendance()}>
            Try Again
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Attendance</h1>
        <Button 
          onClick={() => setIsActivateAttendanceOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 gap-2"
        >
          <PlusCircle size={16} />
          Add Attendance
        </Button>
      </div>

      <SearchAndFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenFilter={() => setIsFilterOpen(true)}
        onOpenActivateAttendance={() => setIsActivateAttendanceOpen(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <AttendanceSessionsList filteredSessions={filteredSessions} />
        <AttendanceTable />
      </div>

      <ActivateAttendanceDialog 
        open={isActivateAttendanceOpen}
        onOpenChange={setIsActivateAttendanceOpen}
        onAttendanceActivated={handleActivateAttendance}
        courses={courses.map(course => ({ 
          id: course.id, 
          name: `${course.courseName} (${course.courseCode})` 
        }))}
        sessions={academicSessions.map(session => ({
          id: session.id,
          name: session.sessionName
        }))}
      />

      <FilterModal 
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        options={filterOptions}
        onApplyFilters={handleApplyFilters}
        groups={['Level', 'Semester', 'Status']}
      />
    </DashboardLayout>
  );
}
