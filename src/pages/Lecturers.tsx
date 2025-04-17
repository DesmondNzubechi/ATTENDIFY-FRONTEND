
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, Search, Filter, Loader2, Plus } from 'lucide-react';
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
import { useLecturersStore, Lecturer } from '@/stores/useLecturersStore';
import { AddLecturerDialog } from '@/components/lecturers/AddLecturerDialog';
import { ViewLecturerDialog } from '@/components/lecturers/ViewLecturerDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Lecturers() {
  const { lecturers, isLoading, error, fetchAllLecturers, addLecturer, deleteLecturer } = useLecturersStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddLecturerOpen, setIsAddLecturerOpen] = useState(false);
  const [viewLecturer, setViewLecturer] = useState<Lecturer | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [lectureToDelete, setLecturerToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const itemsPerPage = 10;

  // Filter options
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([
    { id: 'faculty-engineering', label: 'Faculty of Engineering', checked: false, group: 'Faculty' },
    { id: 'dept-electrical', label: 'Department of Electrical', checked: false, group: 'Department' },
  ]);

  useEffect(() => {
    fetchAllLecturers().catch(error => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch lecturers",
        variant: "destructive",
      });
    });
  }, [fetchAllLecturers, toast]);

  const handleApplyFilters = (updatedFilters: FilterOption[]) => {
    setFilterOptions(updatedFilters);
    toast({
      title: "Filters Applied",
      description: "Your filter preferences have been applied.",
    });
  };

  const handleAddLecturer = async (lecturerData: { fullName: string; email: string }) => {
    const result = await addLecturer(lecturerData);
    if (!result) {
      throw new Error("Failed to add lecturer");
    }
  };

  const handleViewLecturer = (lecturer: Lecturer) => {
    setViewLecturer(lecturer);
    setIsViewOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setLecturerToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (lectureToDelete) {
      try {
        await deleteLecturer(lectureToDelete);
        toast({
          title: "Success",
          description: "Lecturer has been deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to delete lecturer",
          variant: "destructive",
        });
      } finally {
        setIsDeleteDialogOpen(false);
        setLecturerToDelete("");
      }
    }
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
          return lecturer.faculty === 'Engineering';
        }
        if (filter.group === 'Department') {
          return lecturer.department === 'Electrical';
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

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center p-8">
          <h2 className="text-xl font-bold text-red-500 mb-4">Error Loading Lecturers</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => fetchAllLecturers()}>Try Again</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between mt-[40px] md:mt-0 flex-col md:flex-row items-center mb-6">
        <h1 className="text-2xl uppercase font-bold">Lecturers</h1>
        <div className="flex  w-full md:w-fit  flex-col md:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search"
              className="pl-8 w-full md:w-[200px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className='flex gap-2 '>
          <Button 
            variant="outline" 
            className="gap-2 w-full md:w-fit"
            onClick={() => setIsFilterOpen(true)}
          >
            <Filter size={16} />
            Filter
          </Button>
          <Button 
            className="gap-2  w-full  md:w-fit"
            onClick={() => setIsAddLecturerOpen(true)}
          >
            <Plus size={16} />
            Add Lecturer
          </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lecturer Details</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
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
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          ) : (
            <>
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
                  {paginatedLecturers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        No lecturers found. Add a new lecturer to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedLecturers.map((lecturer) => (
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
                            <button 
                              className="text-yellow-500 hover:text-yellow-600"
                              onClick={() => handleViewLecturer(lecturer)}
                            >
                              <Eye size={16} />
                            </button>
                            <button 
                              className="text-red-500 hover:text-red-600"
                              onClick={() => handleDeleteClick(lecturer.id)}
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
                    {Array.from({ length: Math.min(pageCount, 5) }, (_, i) => {
                      let pageNum = i + 1;
                      if (pageCount > 5 && currentPage > 3) {
                        pageNum = currentPage + i - 2;
                        if (pageNum > pageCount) return null;
                      }
                      return (
                        <Button 
                          key={pageNum}
                          variant={pageNum === currentPage ? "default" : "outline"} 
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
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

      <FilterModal 
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        options={filterOptions}
        onApplyFilters={handleApplyFilters}
        groups={['Faculty', 'Department']}
      />

      <AddLecturerDialog
        open={isAddLecturerOpen}
        onOpenChange={setIsAddLecturerOpen}
        onLecturerAdded={handleAddLecturer}
      />

      <ViewLecturerDialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        lecturer={viewLecturer}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the lecturer account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
