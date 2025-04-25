
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, Search, Filter, UserPlus, Loader2 } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddStudentDialog } from '@/components/dashboard/AddStudentDialog';
import { useToast } from '@/hooks/use-toast';
import { useStudentsStore } from '@/stores/useStudentsStore';
import { addStudentData, studentsService } from '@/services/api/studentsService';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { StudentSkeleton } from '@/components/dashboard/StudentSkeleton';

export default function Students() {
  const { 
    students, 
    isLoading, 
    error, 
    fetchStudents,
    addStudent: addStudentToStore,
    deleteStudent: deleteStudentFromStore,
    setError
  } = useStudentsStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const itemsPerPage = 10;

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Get unique levels from students
  const levels = React.useMemo(() => {
    const uniqueLevels = new Set<string>();
    students.forEach(student => {
      if (student.level) {
        uniqueLevels.add(student.level);
      }
    });
    return Array.from(uniqueLevels).sort();
  }, [students]);

  // Get unique admission years from students
  const admissionYears = React.useMemo(() => {
    const uniqueYears = new Set<string>();
    students.forEach(student => {
      if (student.admissionYear) {
        uniqueYears.add(student.admissionYear);
      }
    });
    return Array.from(uniqueYears).sort((a, b) => parseInt(b) - parseInt(a)); // Sort descending
  }, [students]);

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.course && student.course.toLowerCase().includes(searchQuery.toLowerCase())) ||
      student.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.level && student.level.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesLevel = !selectedLevel || student.level === selectedLevel;
    const matchesYear = !selectedYear || student.admissionYear === selectedYear;
    
    return matchesSearch && matchesLevel && matchesYear;
  });

  const pageCount = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteConfirmation = (studentId: string) => {
    setStudentToDelete(studentId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteStudent = async () => {
    if (!studentToDelete) return;
    
    try {
      await studentsService.deleteStudent(studentToDelete);
      deleteStudentFromStore(studentToDelete);
      toast({
        title: "Student Deleted",
        description: "The student has been removed from the system.",
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete student');
      toast({
        title: "Error",
        description: "Failed to delete student. Please try again.",
        variant: "destructive"
      });
    }
    
    setIsDeleteDialogOpen(false);
    setStudentToDelete(null);
  };

  const handleAddStudent = async (newStudent: addStudentData | any) => {
    try {
      const response = await studentsService.createStudent({
        name: `${newStudent.firstName} ${newStudent.lastName}`,
        email: newStudent.email,
        regNo: newStudent.regNo,   
        level: newStudent.level || '100', 
        addmissionYear: newStudent.addmissionYear,
        fingerPrint: newStudent.regNo
      });
      
      // Add to store with the id from the response
      if (response && response.data && response.data.data && response.data.data[0]) {
        const addedStudent = response.data.data[0];
        addStudentToStore({
          id: addedStudent._id,
          firstName: newStudent.firstName,
          lastName: newStudent.lastName,
          fullName: addedStudent.name,
          email: newStudent.email,
          registrationNumber: addedStudent.regNo.toString(),
          course: newStudent.course,
          level: addedStudent.level,
          admissionYear: addedStudent.addmissionYear || new Date().getFullYear().toString(),
          avatar: '/placeholder.svg'
        });
      }
      
      toast({
        title: "Student Added Successfully!",
        description: "The student has been added to the system.",
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add student');
      toast({
        title: "Error",
        description: "Failed to add student. Please try again.",
        variant: "destructive"
      });
    }
  }; 

  const handleResetFilters = () => {
    setSelectedLevel('');
    setSelectedYear('');
    setSearchQuery('');
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Students</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Student Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Registration Number</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Admission Year</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <StudentSkeleton />
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }
  

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <p className="text-red-500 mb-4">Error loading students: {error}</p>
          <Button 
            onClick={() => fetchStudents()}
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
      <div className="flex justify-between flex-col md:flex-row mt-[40px] md:mt-0 items-center mb-6">
        <h1 className="text-2xl uppercase font-bold">Students</h1>
        <div className="flex gap-2 flex-col md:flex-row w-full md:w-fit">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search"
              className="pl-8 w-full md:w-[200px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className='flex gap-2'>
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="md:w-fit">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="100">All Levels</SelectItem>
              {levels && levels?.map(level => (
                <SelectItem key={level} value={level}>Level {level}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="md:w-fit">
              <SelectValue placeholder="Admission Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2020">All Years</SelectItem>
              {admissionYears && admissionYears?.map(year => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          </div>
        
          {(selectedLevel || selectedYear || searchQuery) && (
            <Button variant="outline" onClick={handleResetFilters}>
              Reset Filters
            </Button>
          )}
          <Button 
            className="bg-blue-600 hover:bg-blue-700 gap-2"
            onClick={() => setIsAddStudentOpen(true)}
          >
            <UserPlus size={16} />
            Add Student
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Registration Number</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Admission Year</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                    No students found. Please add a new student.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <img src={student.avatar} alt={student.fullName} className="object-cover" />
                        </Avatar>
                        <span>{student.fullName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.registrationNumber}</TableCell>
                    <TableCell>{student.level}</TableCell>
                    <TableCell>{student.admissionYear}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <button className="text-yellow-500 hover:text-yellow-600">
                          <Eye size={16} />
                        </button>
                        <button 
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteConfirmation(student.id)}
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
                {filteredStudents.length} Results
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
 
      <AddStudentDialog 
        open={isAddStudentOpen}
        onOpenChange={setIsAddStudentOpen}
        onStudentAdded={handleAddStudent}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this student? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteStudent} 
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
