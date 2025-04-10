
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, Search, Filter } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Lecturer = {
  id: string;
  name: string;
  email: string;
  faculty: string;
  department: string;
  avatar: string;
};

const initialLecturers: Lecturer[] = [
  {
    id: '1',
    name: 'Elizabeth Alan',
    email: 'elena@gmail.com',
    faculty: 'Science',
    department: 'Chemistry',
    avatar: '/placeholder.svg'
  },
  {
    id: '2',
    name: 'Desmond Nyeko',
    email: 'desmond@gmail.com',
    faculty: 'Engineering',
    department: 'Civil Engineering',
    avatar: '/placeholder.svg'
  },
  {
    id: '3',
    name: 'Cedar James',
    email: 'cedar@gmail.com',
    faculty: 'Arts',
    department: 'Philosophy',
    avatar: '/placeholder.svg'
  },
  {
    id: '4',
    name: 'Elizabeth Alan',
    email: 'elena@gmail.com',
    faculty: 'Science',
    department: 'Chemistry',
    avatar: '/placeholder.svg'
  },
  {
    id: '5',
    name: 'Desmond Nyeko',
    email: 'desmond@gmail.com',
    faculty: 'Engineering',
    department: 'Civil Engineering',
    avatar: '/placeholder.svg'
  },
  {
    id: '6',
    name: 'Cedar James',
    email: 'cedar@gmail.com',
    faculty: 'Arts',
    department: 'Philosophy',
    avatar: '/placeholder.svg'
  },
  {
    id: '7',
    name: 'Elizabeth Alan',
    email: 'elena@gmail.com',
    faculty: 'Science',
    department: 'Chemistry',
    avatar: '/placeholder.svg'
  },
];

export default function Lecturers() {
  const [lecturers] = useState<Lecturer[]>(initialLecturers);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredLecturers = lecturers.filter(lecturer => 
    lecturer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lecturer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lecturer.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pageCount = Math.ceil(filteredLecturers.length / itemsPerPage);
  const paginatedLecturers = filteredLecturers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lecturer</h1>
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
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lecturer Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Faculty</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLecturers.map((lecturer) => (
                <TableRow key={lecturer.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <img src={lecturer.avatar} alt={lecturer.name} className="object-cover" />
                      </Avatar>
                      <span>{lecturer.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{lecturer.email}</TableCell>
                  <TableCell>{lecturer.faculty}</TableCell>
                  <TableCell>{lecturer.department}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <button className="text-yellow-500 hover:text-yellow-600">
                        <Eye size={16} />
                      </button>
                      <button className="text-red-500 hover:text-red-600">
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
                {filteredLecturers.length} Results
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
    </DashboardLayout>
  );
}
