
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, PlusCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SearchAndFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenFilter: () => void;
  onOpenActivateAttendance: () => void;
  levels?: string[];
  courses?: { id: string, name: string, code: string }[];
  academicSessions?: { id: string, name: string }[];
  semesters?: string[];
  selectedLevel: string;
  selectedCourse: string;
  selectedSession: string;
  selectedSemester: string;
  onLevelChange: (level: string) => void;
  onCourseChange: (course: string) => void;
  onSessionChange: (session: string) => void;
  onSemesterChange: (semester: string) => void;
}

export const SearchAndFilters = ({ 
  searchQuery, 
  setSearchQuery, 
  onOpenFilter, 
  onOpenActivateAttendance,
  levels = [],
  courses = [],
  academicSessions = [],
  semesters = ["first semester", "second semester"],
  selectedLevel,
  selectedCourse,
  selectedSession,
  selectedSemester,
  onLevelChange,
  onCourseChange,
  onSessionChange,
  onSemesterChange
}: SearchAndFiltersProps) => {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl uppercase font-bold">Attendance</h1>
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
            onClick={onOpenFilter}
          >
            <Filter size={16} />
            Filter
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 gap-2"
            onClick={onOpenActivateAttendance}
          >
             <PlusCircle size={16} />
            Add Attendance
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Level</label>
          <Select value={selectedLevel} onValueChange={onLevelChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Levels</SelectItem>
              {levels.map((level) => (
                <SelectItem key={level} value={level}>{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">Course</label>
          <Select value={selectedCourse} onValueChange={onCourseChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Courses</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>{course.code} - {course.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">Academic Session</label>
          <Select value={selectedSession} onValueChange={onSessionChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Session" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Sessions</SelectItem>
              {academicSessions.map((session) => (
                <SelectItem key={session.id} value={session.id}>{session.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">Semester</label>
          <Select value={selectedSemester} onValueChange={onSemesterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Semesters</SelectItem>
              {semesters.map((semester) => (
                <SelectItem key={semester} value={semester}>{semester}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
