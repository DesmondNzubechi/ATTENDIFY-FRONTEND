
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { ActivateAttendanceDialog } from '@/components/dashboard/ActivateAttendanceDialog';
import { FilterModal, FilterOption } from '@/components/dashboard/FilterModal';
import { useAttendanceStore } from '@/stores/useAttendanceStore';
import { SearchAndFilters } from '@/components/attendance/SearchAndFilters';
import { AttendanceSessionsList } from '@/components/attendance/AttendanceSessionsList';
import { AttendanceTable } from '@/components/attendance/AttendanceTable';

export default function Attendance() {
  const { toast } = useToast();
  const { sessions, isLoading, addSession } = useAttendanceStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isActivateAttendanceOpen, setIsActivateAttendanceOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  const handleActivateAttendance = (data: any) => {
    // Generate a simple ID for the new session
    const newSession = {
      id: `${sessions.length + 1}`,
      course: data.course,
      level: data.level,
      sessionName: data.session,
      date: new Date().toISOString(),
      isActive: true,
      students: [
        {
          id: '1',
          name: 'Elizabeth Alan',
          registrationNumber: 'P7345H3234',
          attendance: {}
        },
        {
          id: '2',
          name: 'Desmond Nyeko',
          registrationNumber: 'P7346H3234',
          attendance: {}
        },
        {
          id: '3',
          name: 'Cedar James',
          registrationNumber: 'P7346H3224',
          attendance: {}
        },
        {
          id: '4',
          name: 'Sophie Garcia',
          registrationNumber: 'P7347H3234',
          attendance: {}
        },
        {
          id: '5',
          name: 'Michael Wong',
          registrationNumber: 'P7348H3234',
          attendance: {}
        }
      ]
    };
    
    addSession(newSession);
    toast({
      title: "Attendance Activated",
      description: "Attendance session has been activated successfully.",
    });
  };

  const handleApplyFilters = (updatedFilters: FilterOption[]) => {
    setFilterOptions(updatedFilters);
  };

  // Filter attendance sessions based on search query and filter options
  const filteredSessions = React.useMemo(() => {
    const activatedFilters = filterOptions.filter(filter => filter.checked);
    
    return sessions.filter((session) => {
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
  }, [sessions, searchQuery, filterOptions]);

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
