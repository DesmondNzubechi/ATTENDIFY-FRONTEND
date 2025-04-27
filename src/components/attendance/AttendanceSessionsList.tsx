import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useAttendanceStore,
  AttendanceSession,
} from "@/stores/useAttendanceStore";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";

interface AttendanceSessionsListProps {
  filteredSessions: AttendanceSession[];
}

export const AttendanceSessionsList = ({
  filteredSessions,
}: AttendanceSessionsListProps) => {
  const { selectedSession, setSelectedSession, deleteSession } =
    useAttendanceStore();
  const [currentPage, setCurrentPage] = useState(1);
  const sessionsPerPage = 5;

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
      return "date unknown";
    }
  };

  // Pagination logic
  const indexOfLastSession = currentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = filteredSessions.slice(
    indexOfFirstSession,
    indexOfLastSession
  );

  const totalPages = Math.ceil(filteredSessions.length / sessionsPerPage);

  return (
    <>
      <Card className="lg:col-span-8">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span className="text-[15px] md:text-[20px] ">
              Attendance Sessions
            </span>
            <Badge className="bg-blue-500">
              {filteredSessions.length} Sessions
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSessions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No attendance sessions found.
            </p>
          ) : (
            <div className="overflow-auto max-h-[60vh]">
              <table className="min-w-full text-sm text-left border rounded-md">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr>
                    <th className="p-3">Course</th>
                    <th className="p-3">Level</th>
                    <th className="p-3">Session</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Semester</th>
                    <th className="p-3">Present</th>
                    <th className="p-3">Absent</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentSessions.map((session) => {
                    const today = new Date().toISOString().split("T")[0];
                    const presentCount =
                      session.students?.filter(
                        (s) => s.attendance[today]?.status === "present"
                      ).length || 0;
                    const absentCount =
                      session.students?.filter(
                        (s) => s.attendance[today]?.status === "absent"
                      ).length || 0;

                    return (
                      <tr
                        key={session.id}
                        className={`border-b hover:bg-gray-50 cursor-pointer ${
                          selectedSession?.id === session.id ? "bg-blue-50" : ""
                        }`}
                        onClick={() => setSelectedSession(session)}
                      >
                        <td className="p-3 font-medium">
                          {session.course} ({session.courseCode})
                        </td>
                        <td className="p-3">{session.level}</td>
                        <td className="p-3">{session?.sessionName}</td>
                        <td className="p-3">
                          {formatDate(session.date)}
                          <br />
                          <span className="text-xs text-gray-500">
                            ({getTimeAgo(session.date)})
                          </span>
                        </td>
                        <td className="p-3">{session.semester}</td>
                        <td className=" p-3 text-green-600 ">{presentCount}</td>
                        <td className="p-3 text-red-600 ">{absentCount}</td>
                        <td className="p-3">
                          {session.isActive ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                              Active
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-gray-100 text-gray-800 hover:bg-gray-200"
                            >
                              Inactive
                            </Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
