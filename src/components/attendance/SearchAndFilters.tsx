import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAttendanceStore } from "@/stores/useAttendanceStore";
import { Filter, PlusCircle, Search } from "lucide-react";
import { Input } from "../ui/input";

interface SearchAndFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenFilter: () => void;
  onOpenActivateAttendance: () => void;
  level: string | number;
  academicSession: string;
  semester: string;
  setSemester: (sem: string) => void;
  setAcademicSession: (acad: string) => void;
  setLevel: (level: string | number) => void;
  theCourse: string;
  setTheCourse: (course: string) => void;
}

export const SearchAndFilters = ({
  searchQuery,
  setSearchQuery,
  onOpenFilter,
  onOpenActivateAttendance,
}: SearchAndFiltersProps) => {
  const { sessions: attendanceSession, setSelectedSession } =
    useAttendanceStore();
  const [level, setLevel] = useState("");
  const [academicSession, setAcademicSession] = useState("");
  const [semester, setSemester] = useState("");
  const [theCourse, setTheCourse] = useState("");

  const [filteredAttendances, setFilteredAttendances] = useState();

  console.log(attendanceSession, "The main main main attendance");

  // Get unique session names from attendance data
  const sessionNames = Array.from(
    new Set(attendanceSession.map((session) => session.sessionName))
  );

  // Get filtered attendance sessions based on selected session, level, and semester
  const filteredAttendanceSessions = attendanceSession.filter(
    (session) =>
      session.sessionName === academicSession &&
      session.level === level &&
      session.semester === semester
  );



  console.log(filteredAttendances, "The filtered attendance");
  return (
    <div className="flex justify-between md:flex-row gap-5 flex-col mt-[40px] md:mt-0 items-center mb-6">
      <h1 className="text-2xl uppercase font-bold">Attendance</h1>
      <div className="flex w-full md:w-fit flex-col md:flex-row gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search"
            className="pl-8 w-full outline-0 border-0 appearance-none md:w-[200px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            className="bg-blue-600 w-full md:w-fit hover:bg-blue-700 gap-2"
            onClick={onOpenFilter}
          >
            <Filter size={16} />
            Filter
          </Button>
          <Button
            className="bg-blue-600 w-full md:w-fit hover:bg-blue-700 gap-2"
            onClick={onOpenActivateAttendance}
          >
            <PlusCircle size={16} />
            Add Attendance
          </Button>
        </div>
      </div>
    </div>
  );
};
