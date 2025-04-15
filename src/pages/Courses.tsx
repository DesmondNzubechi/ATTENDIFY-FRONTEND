
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, PlusCircle, Eye, Trash2, Edit, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell, 
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddCourseDialog } from '@/components/dashboard/AddCourseDialog';
import { useCoursesStore } from '@/stores/useCoursesStore';
import { coursesService } from '@/services/api/coursesService';

export default function Courses() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const { toast } = useToast();
  const { 
    courses, 
    isLoading, 
    error, 
    fetchCourses,
    addCourse: addCourseToStore,
    deleteCourse: deleteCourseFromStore,
    setError
  } = useCoursesStore();
  
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await coursesService.deleteCourse(courseId);
      deleteCourseFromStore(courseId);
      toast({
        title: "Course Deleted",
        description: "The course has been removed from the system.",
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete course');
      toast({
        title: "Error",
        description: "Failed to delete course. Please try again.",
        variant: "destructive"
      });
    }
  };
 
  const handleAddCourse = async (newCourse: any) => {
    try {
      const response = await coursesService.addCourse({
        courseTitle: newCourse.courseName,
        courseCode: newCourse.courseCode,
        level: newCourse.level,
        semester: newCourse.semester
      });
      
      // Add to store with the id from the response
      if (response && response.data && response.data.data && response.data.data[0]) {
        const addedCourse = response.data.data[0];
        addCourseToStore({
          id: addedCourse._id,
          courseName: addedCourse.courseTitle,
          courseCode: addedCourse.courseCode,
          description: `${addedCourse.courseTitle} - ${addedCourse.semester}`,
          level: addedCourse.level,
          semester: addedCourse.semester
        });
      }
      
      toast({
        title: "Course Added",
        description: "The course has been added successfully.",
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add course');
      toast({
        title: "Error",
        description: "Failed to add course. Please try again.",
        variant: "destructive"
      });
    }
  };

  const filteredCourses = courses.filter((course) => 
    course.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const pageCount = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[70vh]">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          <span className="ml-2 text-blue-500">Loading courses...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <p className="text-red-500 mb-4">Error loading courses: {error}</p>
          <Button 
            onClick={() => fetchCourses()}
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Courses</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search courses"
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
            onClick={() => setIsAddCourseOpen(true)}
          >
            <PlusCircle size={16} />
            Add Course
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Name</TableHead>
                <TableHead>Course Code</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCourses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                    No courses found. Please add a new course.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>{course.courseName}</TableCell>
                    <TableCell>{course.courseCode}</TableCell>
                    <TableCell>{course.level || 'Not specified'}</TableCell>
                    <TableCell>{course.semester || 'Not specified'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <button className="text-blue-500 hover:text-blue-600">
                          <Eye size={16} />
                        </button>
                        <button className="text-yellow-500 hover:text-yellow-600">
                          <Edit size={16} />
                        </button>
                        <button 
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteCourse(course.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {pageCount > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                {filteredCourses.length} Results
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  &lt;
                </Button>
                {Array.from({ length: pageCount }, (_, i) => i + 1).map(page => (
                  <Button 
                    key={page}
                    variant={page === currentPage ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
                  disabled={currentPage === pageCount}
                >
                  &gt;
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AddCourseDialog 
        open={isAddCourseOpen}
        onOpenChange={setIsAddCourseOpen}
        onCourseAdded={handleAddCourse}
      />
    </DashboardLayout>
  );
}
