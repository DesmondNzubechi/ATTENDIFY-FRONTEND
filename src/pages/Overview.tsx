
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { StudentDetails } from '@/components/dashboard/StudentDetails';
import { AddStudentDialog } from '@/components/dashboard/AddStudentDialog';
import { SuccessDialog } from '@/components/dashboard/SuccessDialog';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { Users, UserPlus, BookOpen, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useStudentsStore } from '@/stores/useStudentsStore';
import { useCoursesStore } from '@/stores/useCoursesStore';
import { useLecturersStore } from '@/stores/useLecturersStore';

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  registrationNumber: string;
  email: string;
  course: string;
};

export default function Overview() {
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      firstName: 'Elizabeth',
      lastName: 'Alan',
      avatar: '/placeholder.svg',
      registrationNumber: 'P7345H3234',
      email: 'elizabeth@gmail.com',
      course: 'Medicine & Surgery'
    },
    {
      id: '2',
      firstName: 'Desmond',
      lastName: 'Nyeko',
      avatar: '/placeholder.svg',
      registrationNumber: 'P7346H3234',
      email: 'desmond@gmail.com',
      course: 'Law'
    },
    {
      id: '3',
      firstName: 'Cedar',
      lastName: 'James',
      avatar: '/placeholder.svg',
      registrationNumber: 'P7346H3224',
      email: 'cedar@gmail.com',
      course: 'Engineering'
    }
  ]);
  
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const { toast } = useToast();

  // Get data from stores
  const { students: backendStudents } = useStudentsStore();
  const { courses } = useCoursesStore();
  const { lecturers, fetchAllLecturers } = useLecturersStore();

  // Fetch data on component mount
  useEffect(() => {
    fetchAllLecturers();
  }, [fetchAllLecturers]);

  const handleAddStudent = (newStudent: any) => {
    const studentWithId = {
      ...newStudent,
      id: `${students.length + 1}`,
      avatar: '/placeholder.svg',
      firstName: newStudent.firstName,
      lastName: newStudent.lastName,
    };
    
    setStudents([...students, studentWithId]);
    setIsSuccessDialogOpen(true);
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents(students.filter(student => student.id !== studentId));
    toast({
      title: "Student Removed",
      description: "The student has been removed from the system."
    });
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Overview</h1>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsAddStudentOpen(true)}
        >
          + Add new student
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          icon={<Users size={24} />} 
          title="All Students" 
          value={backendStudents.length.toString()} 
          change={{ value: "2.5%", type: "increase" }}
          color="blue"
        />
        <StatCard 
          icon={<UserPlus size={24} />} 
          title="New Students" 
          value="5,014" 
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
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
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
    </DashboardLayout>
  );
}
