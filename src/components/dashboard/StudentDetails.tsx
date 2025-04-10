
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Eye, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  registrationNumber: string;
  email: string;
  course: string;
};

const defaultStudents: Student[] = [
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
];

interface StudentDetailsProps {
  students?: Student[];
  onViewStudent?: (student: Student) => void;
  onDeleteStudent?: (studentId: string) => void;
}

export function StudentDetails({ 
  students = defaultStudents,
  onViewStudent,
  onDeleteStudent
}: StudentDetailsProps) {
  
  const handleView = (student: Student) => {
    if (onViewStudent) {
      onViewStudent(student);
    } else {
      console.log('View student:', student);
    }
  };

  const handleDelete = (studentId: string) => {
    if (onDeleteStudent) {
      onDeleteStudent(studentId);
    } else {
      console.log('Delete student ID:', studentId);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">Student Details</CardTitle>
        <button className="text-xs text-blue-500">View all</button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Registration Number</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Course Enrolled</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <img 
                          src={student.avatar} 
                          alt={`${student.firstName} ${student.lastName}`} 
                          className="object-cover"
                        />
                      </Avatar>
                      <span>{student.firstName} {student.lastName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{student.registrationNumber}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.course}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <button 
                        className="text-yellow-500 hover:text-yellow-600"
                        onClick={() => handleView(student)}
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDelete(student.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
