
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Eye, Trash2 } from 'lucide-react';

type Student = {
  id: string;
  name: string;
  avatar?: string;
  registrationNumber: string;
  email: string;
  course: string;
};

const students: Student[] = [
  {
    id: '1',
    name: 'Elizabeth Alan',
    avatar: '/placeholder.svg',
    registrationNumber: 'P7345H3234',
    email: 'elizabeth@gmail.com',
    course: 'Medicine & Surgery'
  },
  {
    id: '2',
    name: 'Desmond Nyeko',
    avatar: '/placeholder.svg',
    registrationNumber: 'P7346H3234',
    email: 'desmond@gmail.com',
    course: 'Law'
  },
  {
    id: '3',
    name: 'Cedar James',
    avatar: '/placeholder.svg',
    registrationNumber: 'P7346H3224',
    email: 'cedar@gmail.com',
    course: 'Engineering'
  }
];

export function StudentDetails() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">Student Details</CardTitle>
        <button className="text-xs text-blue-500">View all</button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="pb-3 font-medium text-gray-500">Name</th>
                <th className="pb-3 font-medium text-gray-500">Registration Number</th>
                <th className="pb-3 font-medium text-gray-500">Email</th>
                <th className="pb-3 font-medium text-gray-500">Course Enrolled</th>
                <th className="pb-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b border-gray-100">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <img 
                          src={student.avatar} 
                          alt={student.name} 
                          className="object-cover"
                        />
                      </Avatar>
                      <span>{student.name}</span>
                    </div>
                  </td>
                  <td className="py-3">{student.registrationNumber}</td>
                  <td className="py-3">{student.email}</td>
                  <td className="py-3">{student.course}</td>
                  <td className="py-3">
                    <div className="flex space-x-2">
                      <button className="text-yellow-500 hover:text-yellow-600">
                        <Eye size={16} />
                      </button>
                      <button className="text-red-500 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
