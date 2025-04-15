
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Play, PlusCircle } from 'lucide-react';

interface SearchAndFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenFilter: () => void;
  onOpenActivateAttendance: () => void;
}

export const SearchAndFilters = ({ 
  searchQuery, 
  setSearchQuery, 
  onOpenFilter, 
  onOpenActivateAttendance 
}: SearchAndFiltersProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl uppercase font-bold">Attendance</h1>
      <div className="flex gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search attendance"
            className="pl-8 w-[200px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={onOpenFilter}
        >
          <Filter size={16} />
          Filter
        </Button>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 gap-2"
          onClick={onOpenActivateAttendance}
        >
           <PlusCircle size={16} />
          Add Attendance
        </Button>
      </div>
    </div>
  );
};
