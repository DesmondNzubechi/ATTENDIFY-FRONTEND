import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  PlusCircle,
  Eye,
  Trash2,
  Edit,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddSessionDialog } from "@/components/dashboard/AddSessionDialog";
import { FilterModal, FilterOption } from "@/components/dashboard/FilterModal";
import { useAcademicSessionsStore } from "@/stores/useAcademicSessionsStore";
import {
  academicSessionsService,
  addSessionData,
} from "@/services/api/academicSessionsService";
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
import { Skeleton } from "@/components/ui/skeleton";

export default function AcademicSessions() {
  const {
    sessions,
    isLoading,
    error,
    fetchSessions,
    addSession: addSessionToStore,
    deleteSession: deleteSessionFromStore,
    setError,
  } = useAcademicSessionsStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddSessionOpen, setIsAddSessionOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  const itemsPerPage = 10;

  // Filter options
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([
    {
      id: "status-active",
      label: "Active Sessions",
      checked: false,
      group: "Status",
    },
    {
      id: "status-upcoming",
      label: "Upcoming Sessions",
      checked: false,
      group: "Status",
    },
    {
      id: "status-completed",
      label: "Completed Sessions",
      checked: false,
      group: "Status",
    },
    { id: "year-2024", label: "Year 2024", checked: false, group: "Year" },
    { id: "year-2025", label: "Year 2025", checked: false, group: "Year" },
    { id: "year-2026", label: "Year 2026", checked: false, group: "Year" },
    { id: "year-2027", label: "Year 2027", checked: false, group: "Year" },
  ]);

  // Fetch academic sessions on component mount
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleApplyFilters = (updatedFilters: FilterOption[]) => {
    setFilterOptions(updatedFilters);
    toast({
      title: "Filters Applied",
      description: "Your filter preferences have been applied.",
    });
  };

  // Filter sessions based on search and filter options
  const filteredSessions = React.useMemo(() => {
    const activatedFilters = filterOptions.filter((filter) => filter.checked);
    const now = new Date();

    return sessions.filter((session) => {
      // Apply text search
      const matchesSearch = session.sessionName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // If no filters are activated, just use text search
      if (activatedFilters.length === 0) {
        return matchesSearch;
      }

      // Apply filters
      const matchesFilters = activatedFilters.some((filter) => {
        if (filter.group === "Status") {
          try {
            const startDate = new Date(session.startDate);
            const endDate = new Date(session.endDate);

            if (filter.id === "status-active") {
              return session.isActive;
            }
            if (filter.id === "status-upcoming") {
              return now < startDate;
            }
            if (filter.id === "status-completed") {
              return now > endDate;
            }
          } catch (error) {
            console.error("Error parsing date:", error);
            return false;
          }
        }

        if (filter.group === "Year") {
          const year = filter.label.split("Year ")[1];
          return session.sessionName.includes(year);
        }

        return true;
      });

      return matchesSearch && matchesFilters;
    });
  }, [sessions, searchQuery, filterOptions]);

  const pageCount = Math.ceil(filteredSessions.length / itemsPerPage);
  const paginatedSessions = filteredSessions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeletePrompt = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    setSessionToDelete(sessionId);
    setIsDeleteDialogOpen(true);
  };

  const handleAddSessionPrompt = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    setIsSessionDialogOpen(true);
  };

  const handleDeleteSession = async () => {
    if (!sessionToDelete) return;

    try {
      await academicSessionsService.deleteSession(sessionToDelete);
      deleteSessionFromStore(sessionToDelete);
      toast({
        title: "Academic Session Deleted",
        description: "The academic session has been removed from the system.",
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete academic session"
      );
      toast({
        title: "Error",
        description: "Failed to delete academic session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddSession = async (newSession: addSessionData) => {
    try {
      const response = await academicSessionsService.createSession({
        name: newSession.name,
        start: newSession.start,
        end: newSession.end,
      });

      console.log("The response", response);
      // Add to store with the id from the response
      if (response && response.data && response.data.data) {
        const addedSession = response.data.data;
        addSessionToStore({
          id: addedSession._id,
          sessionName: addedSession.name,
          startDate: addedSession.start,
          endDate: addedSession.end,
          semesters: addedSession.semesters || [],
          isActive: addedSession.active,
        });
      }

      toast({
        title: "Academic Session Added",
        description: "The academic session has been added successfully.",
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to add academic session"
      );
      toast({
        title: "Error",
        description: "Failed to add academic session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return dateString; // Return the original string if parsing fails
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-64" />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session Name</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Semesters</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <p className="text-red-500 mb-4">
            Error loading academic sessions: {error}
          </p>
          <Button onClick={() => fetchSessions()} variant="outline">
            Try Again
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <DashboardLayout>
        <div className="flex justify-between flex-col md:flex-row items-center mt-[40px] md:mt-0 mb-6">
          <h1 className="text-2xl uppercase font-bold">Academic Sessions</h1>
          <div className="flex md:w-fit w-full gap-2 flex-col md:flex-row">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search sessions"
                className="pl-8 w-full md:w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="gap-2 w-full md:w-fit"
                onClick={() => setIsFilterOpen(true)}
              >
                <Filter size={16} />
                Filter
              </Button>
              <Button
                className="bg-blue-600 w-full md:w-fit hover:bg-blue-700 gap-2"
                onClick={() => setIsSessionDialogOpen(true)}
              >
                <PlusCircle size={16} />
                Add Session
              </Button>
            </div>
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
                  <TableHead>Semesters</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSessions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-10 text-gray-500"
                    >
                      No academic sessions found. Please add a new session.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedSessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>{session.sessionName}</TableCell>
                      <TableCell>{formatDate(session.startDate)}</TableCell>
                      <TableCell>{formatDate(session.endDate)}</TableCell>
                      <TableCell>
                        {session.semesters && session.semesters.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {session.semesters.map((semester, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {semester}
                              </span>
                            ))}
                          </div>
                        ) : (
                          "Not specified"
                        )}
                      </TableCell>
                      <TableCell>
                        {session.isActive ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Inactive
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {/* <button className="text-blue-500 hover:text-blue-600">
                            <Eye size={16} />
                          </button>
                          <button className="text-yellow-500 hover:text-yellow-600">
                            <Edit size={16} />
                          </button> */}
                          <button
                            className="text-red-500 hover:text-red-600"
                            onClick={(e) => handleDeletePrompt(e, session.id)}
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
                  {filteredSessions.length} Results
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    &lt;
                  </Button>
                  {Array.from({ length: pageCount }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    )
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, pageCount))
                    }
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

        <FilterModal
          open={isFilterOpen}
          onOpenChange={setIsFilterOpen}
          options={filterOptions}
          onApplyFilters={handleApplyFilters}
          groups={["Status", "Year"]}
        />
      </DashboardLayout>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              attendance session from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSession}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isSessionDialogOpen}
        onOpenChange={setIsSessionDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to create a new academic session?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Creating a new academic session will mark the end of the current
              session. This action will promote students to the next level, and
              it cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => setIsAddSessionOpen(true)}
              className="bg-green-500 hover:bg-green-600"
            >
              Proceed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
