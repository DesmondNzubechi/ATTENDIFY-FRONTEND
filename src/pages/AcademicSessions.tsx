
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, PlusCircle, Eye, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddSessionDialog } from '@/components/dashboard/AddSessionDialog';

type AcademicSession = {
  id: string;
  sessionName: string;
  startDate: string;
  endDate: string;
};

const initialSessions: AcademicSession[] = [
  {
    id: '1',
    sessionName: '2023/2024',
    startDate: '2023-09-01',
    endDate: '2024-07-31'
  },
  {
    id: '2',
    sessionName: '2024/2025',
    startDate: '2024-09-01',
    endDate: '2025-07-31'
  },
  {
    id: '3',
    sessionName: '2022/2023',
    startDate: '2022-09-01',
    endDate: '2023-07-31'
  }
];

export default function AcademicSessions() {
  const [sessions, setSessions] = useState<AcademicSession[]>(initialSessions);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddSessionOpen, setIsAddSessionOpen] = useState(false);
  const { toast } = useToast();
  const itemsPerPage = 10;

  const filteredSessions = sessions.filter(session => 
    session.sessionName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pageCount = Math.ceil(filteredSessions.length / itemsPerPage);
  const paginatedSessions = filteredSessions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteSession = (sessionId: string) => {
    setSessions(sessions.filter(session => session.id !== sessionId));
    toast({
      title: "Academic Session Deleted",
      description: "The academic session has been removed from the system.",
    });
  };

  const handleAddSession = (newSession: any) => {
    const sessionWithId = {
      ...newSession,
      id: `${sessions.length + 1}`,
    };
    
    setSessions([...sessions, sessionWithId]);
    toast({
      title: "Academic Session Added",
      description: "The academic session has been added successfully.",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Academic Sessions</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search sessions"
              className="pl-8 w-[200px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter size={16} />
            Filter
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 gap-2"
            onClick={() => setIsAddSessionOpen(true)}
          >
            <PlusCircle size={16} />
            Add Session
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Academic Session List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Session Name</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>{session.sessionName}</TableCell>
                  <TableCell>{formatDate(session.startDate)}</TableCell>
                  <TableCell>{formatDate(session.endDate)}</TableCell>
                  <TableCell>
                    {new Date() >= new Date(session.startDate) && new Date() <= new Date(session.endDate) 
                      ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
                      : new Date() < new Date(session.startDate)
                        ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Upcoming</span>
                        : <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Completed</span>
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <button className="text-blue-500 hover:text-blue-600">
                        <Eye size={16} />
                      </button>
                      <button className="text-yellow-500 hover:text-yellow-600">
                        <Edit size={16} />
                      </button>
                      <button 
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDeleteSession(session.id)}
                      >
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
                {filteredSessions.length} Results
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

      <AddSessionDialog 
        open={isAddSessionOpen}
        onOpenChange={setIsAddSessionOpen}
        onSessionAdded={handleAddSession}
      />
    </DashboardLayout>
  );
}
