
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
import { FilterModal, FilterOption } from '@/components/dashboard/FilterModal';
import { useToast } from '@/hooks/use-toast';

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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { toast } = useToast();
  const itemsPerPage = 10;

  // Filter options
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([
    { id: 'faculty-science', label: 'Faculty of Science', checked: false, group: 'Faculty' },
    { id: 'faculty-engineering', label: 'Faculty of Engineering', checked: false, group: 'Faculty' },
    { id: 'faculty-arts', label: 'Faculty of Arts', checked: false, group: 'Faculty' },
    { id: 'faculty-medicine', label: 'Faculty of Medicine & Surgery', checked: false, group: 'Faculty' },
    { id: 'dept-chemistry', label: 'Department of Chemistry', checked: false, group: 'Department' },
    { id: 'dept-physics', label: 'Department of Physics', checked: false, group: 'Department' },
    { id: 'dept-civil', label: 'Department of Civil Engineering', checked: false, group: 'Department' },
    { id: 'dept-philosophy', label: 'Department of Philosophy', checked: false, group: 'Department' },
  ]);

  const handleApplyFilters = (updatedFilters: FilterOption[]) => {
    setFilterOptions(updatedFilters);
    toast({
      title: "Filters Applied",
      description: "Your filter preferences have been applied.",
    });
  };

  // Filter lecturers based on search and filter options
  const filteredLecturers = React.useMemo(() => {
    const activatedFilters = filterOptions.filter(filter => filter.checked);
    
    return lecturers.filter(lecturer => {
      // Apply text search
      const matchesSearch = lecturer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lecturer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lecturer.department.toLowerCase().includes(searchQuery.toLowerCase());
      
      // If no filters are activated, just use text search
      if (activatedFilters.length === 0) {
        return matchesSearch;
      }
      
      // Apply filters
      const matchesFilters = activatedFilters.some(filter => {
        if (filter.group === 'Faculty') {
          return lecturer.faculty === filter.label.split('Faculty of ')[1];
        }
        if (filter.group === 'Department') {
          return lecturer.department === filter.label.split('Department of ')[1];
        }
        return true;
      });
      
      return matchesSearch && matchesFilters;
    });
  }, [lecturers, searchQuery, filterOptions]);

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
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setIsFilterOpen(true)}
          >
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

      <FilterModal 
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        options={filterOptions}
        onApplyFilters={handleApplyFilters}
        groups={['Faculty', 'Department']}
      />
    </DashboardLayout>
  );
}
