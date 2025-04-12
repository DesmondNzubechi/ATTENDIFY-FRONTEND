
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { coursesService, Course } from '@/services/api/coursesService';

export default function Courses() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const itemsPerPage = 10;

  // Fetch courses
  const { data: courses = [], isLoading, isError } = useQuery({
    queryKey: ['courses'],
    queryFn: coursesService.getAllCourses
  });

  // Delete course mutation
  const deleteMutation = useMutation({
    mutationFn: coursesService.deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({
        title: "Course Deleted",
        description: "The course has been removed from the system.",
      });
    }
  });

  // Add course mutation
  const addMutation = useMutation({
    mutationFn: coursesService.addCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({
        title: "Course Added",
        description: "The course has been added successfully.",
      });
    }
  });

  const handleDeleteCourse = (courseId: string) => {
    deleteMutation.mutate(courseId);
  };

  const handleAddCourse = (newCourse: any) => {
    addMutation.mutate(newCourse);
  };

  const filteredCourses = courses.filter((course: Course) => 
    course.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const pageCount = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isError) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <p className="text-red-500 mb-4">Error loading courses</p>
          <Button 
            onClick={() => queryClient.invalidateQueries({ queryKey: ['courses'] })}
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
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Name</TableHead>
                    <TableHead>Course Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCourses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                        No courses found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedCourses.map((course: Course) => (
                      <TableRow key={course.id}>
                        <TableCell>{course.courseName}</TableCell>
                        <TableCell>{course.courseCode}</TableCell>
                        <TableCell className="max-w-xs truncate">{course.description}</TableCell>
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
                              disabled={deleteMutation.isPending}
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
            </>
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
