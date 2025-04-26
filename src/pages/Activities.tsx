
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { activityType, useActivitiesStore } from '@/stores/useActivitiesStore';
import { ActivitySkeleton } from '@/components/dashboard/ActivitySkeleton';


export default function Activities() {
  const {activities, fetchAllActivities, isLoading, error, } = useActivitiesStore();
  const [searchQuery, setSearchQuery] = useState('');

  const { toast } = useToast();
  //const itemsPerPage = 10;

  useEffect(() => {
    fetchAllActivities().catch(error => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch lecturers",
        variant: "destructive",
      });
    });
  }, [fetchAllActivities, toast]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return dateString;
    }
    };
    
    
      const getTimeAgo = (dateString: string) => {
        try {
          const date = new Date(dateString);
          return formatDistanceToNow(date, { addSuffix: true });
        } catch (error) {
          return 'date unknown';
        }
  };
  
  // Inside Activities component

const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  
  //sorterd activities
  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  

// Filtered activities (if you want to add search later)
const filteredActivities = sortedActivities.filter(activity =>
  activity.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  activity.userRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
  activity.action.toLowerCase().includes(searchQuery.toLowerCase())
);


// Paginated slice
const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
const paginatedActivities = filteredActivities.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);

// Navigation handlers
const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));


      if (isLoading) {
        return (
          <DashboardLayout>
            <div className="space-y-4">
              <div className="flex md:flex-row flex-col justify-between items-center mb-6">
                <h1 className="text-2xl uppercase font-bold">All activities</h1>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search"
                    className="pl-8 w-full md:w-[200px]"
                    disabled
                  />
                </div>
              </div>
      
              <Card>
                <CardHeader>
                  <CardTitle>Activities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <ActivitySkeleton key={index} />
                  ))}
                </CardContent>
              </Card>
            </div>
          </DashboardLayout>
        );
      }
      


  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center p-8">
          <h2 className="text-xl font-bold text-red-500 mb-4">Error Loading Activities</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => fetchAllActivities()}>Try Again</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex  md:flex-row flex-col justify-between items-center mt-[40px] md:mt-[] mb-6">
        <h1 className="text-2xl uppercase font-bold">All activities</h1>
        <div className="flex md:w-fit w-full gap-2 md:flex-row flex-col">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search"
              className="pl-8 w-full md:w-[200px]"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
              
            />
          </div>
          {/* <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setIsFilterOpen(true)}
          >
            <Filter size={16} />
            Filter
          </Button>
          <Button 
            className="gap-2"
            onClick={() => setIsAddLecturerOpen(true)}
          >
            <Plus size={16} />
            Add Lecturer
          </Button> */}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activities</CardTitle>
        </CardHeader>
        <CardContent>
  <div className="space-y-4">
    {paginatedActivities.length === 0 ? (
      <p className="text-center text-sm text-gray-500">No activities found.</p>
    ) : (
      paginatedActivities.map((activity: activityType) => (
        <div key={activity.id} className="flex gap-3">
          <Avatar className="h-10 w-10">
            <img 
              src="/placeholder.svg" 
              alt={activity.userName}
              className="object-cover"
            />
          </Avatar>
          <div>
            <h4 className="text-sm font-medium">{activity.userName}</h4>
            <p className="text-xs text-gray-500">{activity.userRole} • Electrical Engineering</p>
            <p className="text-sm mt-1">{activity.action}</p>
            <p className="text-xs text-gray-500 mt-1">
              {formatDate(activity.date)} • {getTimeAgo(activity.date)}
            </p>
          </div>
        </div>
      ))
    )}
  </div>

  {/* Pagination Buttons */}
  {totalPages > 1 && (
    <div className="flex justify-between items-center mt-6">
      <Button variant="outline" onClick={handlePrev} disabled={currentPage === 1}>
        Previous
      </Button>
      <p className="text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </p>
      <Button variant="outline" onClick={handleNext} disabled={currentPage === totalPages}>
        Next
      </Button>
    </div>
  )}
</CardContent>

      </Card>

    

    
    </DashboardLayout>
  );
}
