import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { ActivateAttendanceDialog } from "@/components/dashboard/ActivateAttendanceDialog";
import { FilterModal, FilterOption } from "@/components/dashboard/FilterModal";
import { useAttendanceStore } from "@/stores/useAttendanceStore";
import { SearchAndFilters } from "@/components/attendance/SearchAndFilters";
import { AttendanceSessionsList } from "@/components/attendance/AttendanceSessionsList";
import { AttendanceTable } from "@/components/attendance/AttendanceTable";
import { useCoursesStore } from "@/stores/useCoursesStore";
import { useAcademicSessionsStore } from "@/stores/useAcademicSessionsStore";
import { Button } from "@/components/ui/button";
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
import { CreateAttendanceData } from "@/services/api/attendanceService";
import { AttendanceSkeleton } from "@/components/dashboard/AttendanceSkeleton";
import { useStudentsStore } from "@/stores/useStudentsStore";

export default function Attendance() {
  const { toast } = useToast();
  const {
    sessions,
    isLoading,
    error,
    fetchAttendance,
    createAttendance,
    deleteSession,
    setError,
  } = useAttendanceStore();

  const {
    courses,
    fetchCourses,
    isLoading: coursesLoading,
  } = useCoursesStore();

  const {
    sessions: academicSessions,
    fetchSessions,
    isLoading: sessionsLoading,
  } = useAcademicSessionsStore();
  const { students } = useStudentsStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [isActivateAttendanceOpen, setIsActivateAttendanceOpen] =
    useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  // Additional filters
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedAcademicSession, setSelectedAcademicSession] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  // Setup filter options
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([
    { id: "level-100", label: "Level 100", checked: false, group: "Level" },
    { id: "level-200", label: "Level 200", checked: false, group: "Level" },
    { id: "level-300", label: "Level 300", checked: false, group: "Level" },
    { id: "level-400", label: "Level 400", checked: false, group: "Level" },
    { id: "level-500", label: "Level 500", checked: false, group: "Level" },
    //{ id: 'level-graduate', label: 'Level Graduate', checked: false, group: 'Level' },
    {
      id: "semester-first",
      label: "First Semester",
      checked: false,
      group: "Semester",
    },
    {
      id: "semester-second",
      label: "Second Semester",
      checked: false,
      group: "Semester",
    },
    {
      id: "status-active",
      label: "Active Sessions",
      checked: false,
      group: "Status",
    },
    {
      id: "status-inactive",
      label: "Inactive Sessions",
      checked: false,
      group: "Status",
    },
  ]);

  const uniqueSessions = sessions.filter(
    (session, index, self) =>
      index === self.findIndex((s) => s.sessionName === session.sessionName)
  );

  // Fetch attendance data on component mount
  useEffect(() => {
    fetchAttendance();
    fetchCourses();
    fetchSessions();
  }, [fetchAttendance, fetchCourses, fetchSessions]);

  const handleActivateAttendance = async (data: CreateAttendanceData) => {
    const findStudentLevel = students.filter((st) => {
      return st.level == data.level;
    });

    if (findStudentLevel.length === 0) {
      toast({
        title: "No students offering this course",
        description: "There is no student offering this course at the miment.",
      });
      return;
    }

    try {
      // Format the data for the API
      const attendanceData = {
        ...data,
        semester: data.semester.toLocaleLowerCase(),
      };

      // Call the API to create a new attendance session
      await createAttendance(attendanceData);

      toast({
        title: "Attendance Created",
        description: "Attendance session has been created successfully.",
      });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create attendance"
      );
      toast({
        title: "Error",
        description: "Failed to create attendance. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleApplyFilters = (updatedFilters: FilterOption[]) => {
    setFilterOptions(updatedFilters);
  };

  const handleConfirmDelete = async () => {
    if (!sessionToDelete) return;

    try {
      await deleteSession(sessionToDelete);
      toast({
        title: "Session Deleted",
        description: "The attendance session has been deleted successfully.",
      });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete session"
      );
      toast({
        title: "Error",
        description: "Failed to delete session. Please try again.",
        variant: "destructive",
      });
    }

    setIsDeleteDialogOpen(false);
    setSessionToDelete(null);
  };

  useEffect(() => {
    const courseFilterOptions = courses.map((course) => ({
      id: `course-${course.id}`,
      label: `${course.courseName} (${course.courseCode})`,
      checked: false,
      group: "Course",
    }));

    setFilterOptions((prevOptions) => {
      // Avoid duplicating course filters
      const nonCourseFilters = prevOptions.filter(
        (option) => option.group !== "Course"
      );
      return [...nonCourseFilters, ...courseFilterOptions];
    });
  }, [courses]);

  // Filter attendance sessions based on search query and filter options
  const filteredSessions = React.useMemo(() => {
    const activatedFilters = filterOptions.filter((filter) => filter.checked);

    return sessions.filter((session) => {
      // Apply text search
      const matchesSearch =
        session.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.level.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.sessionName.toLowerCase().includes(searchQuery.toLowerCase());

      // Apply dropdown filters
      const matchesLevel = !selectedLevel || session.level === selectedLevel;

      const matchesCourse =
        !selectedCourse ||
        courses.some(
          (course) =>
            course.id === selectedCourse &&
            (course.courseName === session.course ||
              course.courseCode === session.courseCode)
        );

      const matchesSession =
        !selectedAcademicSession ||
        selectedAcademicSession === "all" ||
        session.sessionName ===
          uniqueSessions.find((s) => s.sessionId === selectedAcademicSession)
            ?.sessionName;

      const matchesSemester =
        !selectedSemester ||
        session.semester.toLowerCase() === selectedSemester.toLowerCase();

      // If no filters are activated, just use text search and dropdown filters
      if (activatedFilters.length === 0) {
        return (
          matchesSearch &&
          matchesLevel &&
          matchesCourse &&
          matchesSession &&
          matchesSemester
        );
      }

      // Apply additional filters
      const matchesFilters = activatedFilters.some((filter) => {
        if (filter.group === "Level") {
          return session.level === filter.label.split(" ")[1];
        }
        if (filter.group === "Semester") {
          const semester = filter.label.toLowerCase().includes("first")
            ? "first semester"
            : "second semester";
          return session.semester.toLowerCase() === semester;
        }
        if (filter.group === "Status") {
          return (
            (filter.id === "status-active" && session.isActive) ||
            (filter.id === "status-inactive" && !session.isActive)
          );
        }
        if (filter.group === "Course") {
          const formattedLabel = `${session.course} (${session.courseCode})`;
          return filter.label === formattedLabel;
        }

        return true;
      });

      return (
        matchesSearch &&
        matchesFilters &&
        matchesLevel &&
        matchesCourse &&
        matchesSession &&
        matchesSemester
      );
    });
  }, [
    sessions,
    searchQuery,
    filterOptions,
    selectedLevel,
    selectedCourse,
    selectedAcademicSession,
    selectedSemester,
    courses,
    uniqueSessions,
  ]);

  // Show loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <AttendanceSkeleton />
      </DashboardLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col justify-center items-center h-[70vh]">
          <p className="text-red-500 mb-4">
            Error loading attendance data: {error}
          </p>
          <Button onClick={() => fetchAttendance()}>Try Again</Button>
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

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
        <AttendanceSessionsList filteredSessions={filteredSessions} />
        <AttendanceTable />
      </div>

      <ActivateAttendanceDialog
        open={isActivateAttendanceOpen}
        onOpenChange={setIsActivateAttendanceOpen}
        onAttendanceActivated={handleActivateAttendance}
        courses={courses.map((course) => ({
          id: course.id,
          name: `${course.courseName} (${course.courseCode})`,
        }))}
        sessions={academicSessions.map((session) => ({
          id: session.id,
          name: session.sessionName,
        }))}
      />

      <FilterModal
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        options={filterOptions}
        onApplyFilters={handleApplyFilters}
        groups={["Level", "Semester", "Status", "Course"]}
        academicSessions={uniqueSessions}
        onSelectAcademicSession={setSelectedAcademicSession}
        selectedAcademicSession={selectedAcademicSession}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this attendance session? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
