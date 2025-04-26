
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Eye, Link, Trash2 } from 'lucide-react';
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
  course?: string;
  level?: string;
  fullName?: string;
};

interface StudentDetailsProps {
  students?: Student[];
  onViewStudent?: (student: Student) => void;
  onDeleteStudent?: (studentId: string) => void;
}

export function StudentDetails({ 
  students = [],
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
        <button className="text-xs text-blue-500"><a href='/activities' className='text-xs text-blue-500'> View all</a></button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table> 
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Registration Number</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                    No students found
                  </TableCell>
                </TableRow>
              ) : (
                students.slice(0, 4).map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <img 
                            src={student.avatar || '/placeholder.svg'} 
                            alt={`${student.firstName || ''} ${student.lastName || ''}`} 
                            className="object-cover"
                          />
                        </Avatar>
                        <span>
                          {student.fullName || `${student.firstName || ''} ${student.lastName || ''}`}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{student.registrationNumber}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.level || 'Not Specified'}</TableCell>
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
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
