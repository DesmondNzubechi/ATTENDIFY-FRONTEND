
import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { StudentDetails } from '@/components/dashboard/StudentDetails';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { Users, UserPlus, BookOpen, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Overview() {
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Overview</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">+ Add new student</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          icon={<Users size={24} />} 
          title="All Students" 
          value="535,214" 
          change={{ value: "2.5%", type: "increase" }}
          color="blue"
        />
        <StatCard 
          icon={<UserPlus size={24} />} 
          title="New Students" 
          value="5,014" 
          change={{ value: "1.2%", type: "decrease" }}
          color="green"
        />
        <StatCard 
          icon={<BookOpen size={24} />} 
          title="Courses" 
          value="24" 
          color="orange"
        />
        <StatCard 
          icon={<GraduationCap size={24} />} 
          title="Lecturers" 
          value="102" 
          color="purple"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <PerformanceChart />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
      
      <div className="mb-6">
        <StudentDetails />
      </div>
    </DashboardLayout>
  );
}
