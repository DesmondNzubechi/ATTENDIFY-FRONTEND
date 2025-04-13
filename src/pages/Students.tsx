
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, Search, Filter, UserPlus } from 'lucide-react';
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

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  registrationNumber: string;
  course: string;
  avatar: string;
};
 
const initialStudents: Student[] = [
  {
    id: '1',
    firstName: 'Elizabeth',
    lastName: 'Alan',
    email: 'elizabeth@gmail.com',
    registrationNumber: 'P7345H3234',
    course: 'Medicine & Surgery',
    avatar: '/placeholder.svg'
  },
  {
    id: '2',
    firstName: 'Desmond',
    lastName: 'Nyeko',
    email: 'desmond@gmail.com',
    registrationNumber: 'P7346H3234',
    course: 'Law',
    avatar: '/placeholder.svg'
  },
  {
    id: '3',
    firstName: 'Cedar',
    lastName: 'James',
    email: 'cedar@gmail.com',
    registrationNumber: 'P7346H3224',
    course: 'Engineering',
    avatar: '/placeholder.svg'
  },
  {
    id: '4',
    firstName: 'Sophie',
    lastName: 'Garcia',
    email: 'sophie@gmail.com',
    registrationNumber: 'P7347H3234',
    course: 'Computer Science',
    avatar: '/placeholder.svg'
  },
  {
    id: '5',
    firstName: 'Michael',
    lastName: 'Wong',
    email: 'michael@gmail.com',
    registrationNumber: 'P7348H3234',
    course: 'Business Administration',
    avatar: '/placeholder.svg'
  },
  {
    id: '6',
    firstName: 'Olivia',
    lastName: 'Smith',
    email: 'olivia@gmail.com',
    registrationNumber: 'P7349H3234',
    course: 'Psychology',
    avatar: '/placeholder.svg'
  },
  {
    id: '7',
    firstName: 'Ethan',
    lastName: 'Johnson',
    email: 'ethan@gmail.com',
    registrationNumber: 'P7350H3234',
    course: 'Physics',
    avatar: '/placeholder.svg'
  },
];

export default function Students() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const { toast } = useToast();
  const itemsPerPage = 10;

  const filteredStudents = students.filter(student => 
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pageCount = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteStudent = (studentId: string) => {
    setStudents(students.filter(student => student.id !== studentId));
    toast({
      title: "Student Deleted",
      description: "The student has been removed from the system.",
    });
  };

  const handleAddStudent = (newStudent: any) => {
    const studentWithId = {
      ...newStudent,
      id: `${students.length + 1}`,
      avatar: '/placeholder.svg',
    }; 
    
    setStudents([...students, studentWithId]);
    toast({
      title: "Student Added Successfully!",
      description: "The student has been added to the system.",
    });
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Students</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search"
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
                <TableHead>Course Enrolled</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <img src={student.avatar} alt={`${student.firstName} ${student.lastName}`} className="object-cover" />
                      </Avatar>
                      <span>{student.firstName} {student.lastName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.registrationNumber}</TableCell>
                  <TableCell>{student.course}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <button className="text-yellow-500 hover:text-yellow-600">
                        <Eye size={16} />
                      </button>
                      <button 
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDeleteStudent(student.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
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
    </DashboardLayout>
  );
}
