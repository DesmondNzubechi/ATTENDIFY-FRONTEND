
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { activityType, useActivitiesStore } from '@/stores/useActivitiesStore';
import { Avatar } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
// import { Avatar } from '@/components/ui/avatar';

// type Activity = {
//   id: string;
//   user: {
//     name: string;
//     avatar?: string;
//     role: string;
//   };
//   action: string;
//   time: string;
// };

// const activities: Activity[] = [
//   {
//     id: '1',
//     user: {
//       name: 'Desmond Nyeko',
//       avatar: '/placeholder.svg',
//       role: 'Lecturer • Medicine Year Two'
//     },
//     action: 'Created a timetable for Medicine Year Two',
//     time: '2 hours ago'
//   },
//   {
//     id: '2',
//     user: {
//       name: 'Jane Kate',
//       avatar: '/placeholder.svg',
//       role: 'Lecturer • Fundamentals Accounting I'
//     },
//     action: 'Created a timetable for Accounting Year One',
//     time: '5 hours ago'
//   },
//   {
//     id: '3',
//     user: {
//       name: 'John Eze',
//       avatar: '/placeholder.svg',
//       role: 'Lecturer • Data Analysis'
//     },
//     action: 'Modified a class schedule for Data Science',
//     time: '10 hours ago'
//   }
// ];


export function RecentActivity() {

  const {activities, fetchAllActivities, isLoading, error, } = useActivitiesStore();
    const [searchQuery, setSearchQuery] = useState('');
  
    // const { toast } = useToast();
  
  
    // useEffect(() => {
    //   fetchAllActivities().catch(error => {
    //     toast({
    //       title: "Error",
    //       description: error instanceof Error ? error.message : "Failed to fetch lecturers",
    //       variant: "destructive",
    //     });
    //   });
    // }, [fetchAllActivities, toast]);
  
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
  

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
        <button className="text-xs text-blue-500"><Link to='/activities'> View all</Link></button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
           {activities.slice(0, 2).map((activity: activityType) => (
                           <div key={activity.id} className="flex gap-3">
                             <Avatar className="h-10 w-10">
                               <img 
                                 src='/placeholder.svg' 
                                         alt={activity.userName}
                                 className="object-cover"
                               />
                             </Avatar> 
                             <div>
                               <h4 className="text-sm font-medium">{activity.userName}</h4>
                               <p className="text-xs text-gray-500">{activity.userRole} • Electrical Engineering</p>
                               <p className="text-sm mt-1">{activity.action}</p>
                                     <p className="text-xs text-gray-500 mt-1">{formatDate(activity.date)} • { getTimeAgo(activity.date)}</p>
                                 </div>
                                 <hr />
                           </div>
                         ))}
        </div>
      </CardContent>
    </Card>
  );
}
