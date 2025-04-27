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
import { PublicAttendanceTable } from "@/components/attendance/PublicAttendanceTable";
import { PublicSearchAndFilters } from "@/components/attendance/PublicSearchAndFilter";
import Navbar from "@/components/Navbar";

export default function ViewAttendance() {
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

  // Fetch attendance data on component mount
  useEffect(() => {
    fetchAttendance();
    fetchCourses();
    fetchSessions();
  }, [fetchAttendance, fetchCourses, fetchSessions]);

  const handleActivateAttendance = async (data: CreateAttendanceData) => {
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

  // Function to handle session deletion
  const handleDeletePrompt = (sessionId: string) => {
    setSessionToDelete(sessionId);
    setIsDeleteDialogOpen(true);
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
        session.sessionName ===
          academicSessions.find((s) => s.id === selectedAcademicSession)
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
    academicSessions,
  ]);

  // Show loading state
  if (isLoading || coursesLoading || sessionsLoading) {
    return (
      <div className="p-[20px]">
        <AttendanceSkeleton />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div>
        <div className="flex flex-col justify-center items-center h-[70vh]">
          <p className="text-red-500 mb-4">
            Error loading attendance data: {error}
          </p>
          <Button onClick={() => fetchAttendance()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="px-[20px] ">
        <Navbar />
        <div className="relative w-full h-[70vh] my-[100px] flex items-center justify-center bg-gradient-to-r  from-blue-600 via-indigo-700 to-purple-700 rounded-lg shadow-md overflow-hidden">
          <div className="relative z-10 text-center px-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Welcome to Attendance Records
            </h1>
            <p className="text-lg md:text-xl text-gray-200">
              Search, filter, and view attendance sessions with ease.
            </p>
            <div className="mt-6">
              <a href="/view-attendance#attendance">
                <Button className="bg-white text-indigo-700 hover:bg-gray-100 font-semibold px-6 py-3 rounded-full">
                  Get Started
                </Button>
              </a>
            </div>
          </div>
        </div>

              <div id="attendance">
                  
              </div>
        <div  className="p-[20px] smooth pb-[100px]   ">
          <PublicSearchAndFilters />

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
            <AttendanceSessionsList
              filteredSessions={filteredSessions}
              //onDelete={handleDeletePrompt}
            />
            <PublicAttendanceTable />
          </div>
        </div>
      </div>
    </>
  );
}
