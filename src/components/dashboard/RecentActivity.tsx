
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';

type Activity = {
  id: string;
  user: {
    name: string;
    avatar?: string;
    role: string;
  };
  action: string;
  time: string;
};

const activities: Activity[] = [
  {
    id: '1',
    user: {
      name: 'Desmond Nyeko',
      avatar: '/placeholder.svg',
      role: 'Lecturer • Medicine Year Two'
    },
    action: 'Created a timetable for Medicine Year Two',
    time: '2 hours ago'
  },
  {
    id: '2',
    user: {
      name: 'Jane Kate',
      avatar: '/placeholder.svg',
      role: 'Lecturer • Fundamentals Accounting I'
    },
    action: 'Created a timetable for Accounting Year One',
    time: '5 hours ago'
  },
  {
    id: '3',
    user: {
      name: 'John Eze',
      avatar: '/placeholder.svg',
      role: 'Lecturer • Data Analysis'
    },
    action: 'Modified a class schedule for Data Science',
    time: '10 hours ago'
  }
];

export function RecentActivity() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
        <button className="text-xs text-blue-500">View all</button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-3">
              <Avatar className="h-10 w-10">
                <img 
                  src={activity.user.avatar} 
                  alt={activity.user.name}
                  className="object-cover"
                />
              </Avatar>
              <div>
                <h4 className="text-sm font-medium">{activity.user.name}</h4>
                <p className="text-xs text-gray-500">{activity.user.role}</p>
                <p className="text-sm mt-1">{activity.action}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
