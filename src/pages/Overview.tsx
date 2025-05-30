
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { StudentDetails } from '@/components/dashboard/StudentDetails';
import { AddStudentDialog } from '@/components/dashboard/AddStudentDialog';
import { SuccessDialog } from '@/components/dashboard/SuccessDialog';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { Users, UserPlus, BookOpen, GraduationCap, CalendarDays, ClipboardCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCoursesStore } from '@/stores/useCoursesStore';
import { useLecturersStore } from '@/stores/useLecturersStore';
import { useAttendanceStore } from '@/stores/useAttendanceStore';
import { useAcademicSessionsStore } from '@/stores/useAcademicSessionsStore';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { addStudentData, studentsService } from '@/services/api/studentsService';
import { useStudentsStore } from '@/stores/useStudentsStore';

export default function Overview() {
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const { toast } = useToast();

  // Get data from stores
  const { students, fetchStudents, deleteStudent } = useStudentsStore();
  const { courses, fetchCourses } = useCoursesStore();
  const { lecturers, fetchAllLecturers } = useLecturersStore();
  const { sessions: attendanceSessions, fetchAttendance } = useAttendanceStore();
  const { sessions: academicSessions, fetchSessions } = useAcademicSessionsStore();
  const {addStudent, setError} = useStudentsStore()

  // Fetch data on component mount
  useEffect(() => {
    fetchStudents();
    fetchCourses();
    fetchAllLecturers();
    fetchAttendance();
    fetchSessions();
  }, [fetchStudents, fetchCourses, fetchAllLecturers, fetchAttendance, fetchSessions]);

  // const handleAddStudent = (newStudent) => {
  //   setIsSuccessDialogOpen(true);
  // }; 

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
        if (response && response.data && response.data.data && response.data.data) {
          const addedStudent = response.data.data;
          addStudent({
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
 
  const handleDeleteStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteStudent = async () => {
    if (selectedStudentId) {
      try {
        await deleteStudent(selectedStudentId);
        toast({
          title: "Student Removed",
          description: "The student has been removed from the system."
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete student. Please try again.",
          variant: "destructive"
        });
      }
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between mt-[40px] md:mt-0 flex-col md:flex-row items-center mb-6">
        <h1 className="text-2xl uppercase font-bold">Overview</h1>
        <Button 
          className="bg-blue-600 md:w-fit w-full hover:bg-blue-700"
          onClick={() => setIsAddStudentOpen(true)}
        >
          + Add new student
        </Button>
      </div>
       
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <StatCard 
          icon={<Users size={24} />} 
          title="All Students" 
          value={students.length.toString()} 
          change={{ value: "2.5%", type: "increase" }}
          color="blue"
        />
        <StatCard 
          icon={<UserPlus size={24} />} 
          title="New Students" 
          value={(students.length > 0 ? Math.round(students.length * 0.2) : 0).toString()} 
          change={{ value: "1.2%", type: "decrease" }}
          color="green"
        />
        <StatCard 
          icon={<BookOpen size={24} />} 
          title="Courses" 
          value={courses.length.toString()} 
          color="orange"
        />
        <StatCard 
          icon={<GraduationCap size={24} />} 
          title="Lecturers" 
          value={lecturers.length.toString()} 
          color="purple"
        />
        <StatCard 
          icon={<CalendarDays size={24} />} 
          title="Academic Sessions" 
          value={academicSessions.length.toString()} 
          color="blue"
        />
        <StatCard 
          icon={<ClipboardCheck size={24} />} 
          title="Attendance" 
          value={attendanceSessions.length.toString()} 
          color="green"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 h-full">
          <PerformanceChart />
        </div> 
        <div>
          <RecentActivity />
        </div>
      </div>
      
      <div className="mb-6">
        <StudentDetails 
          students={students}
          onDeleteStudent={handleDeleteStudent}
        />
      </div>

      <AddStudentDialog 
        open={isAddStudentOpen}
        onOpenChange={setIsAddStudentOpen}
        onStudentAdded={handleAddStudent}
      />

      <SuccessDialog 
        open={isSuccessDialogOpen}
        onClose={() => setIsSuccessDialogOpen(false)}
        message="Student Added Successfully!"
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the student from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteStudent} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
