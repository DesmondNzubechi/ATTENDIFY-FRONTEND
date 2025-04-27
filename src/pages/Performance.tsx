import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  Download,
  BarChart as BarChartIcon,
  LineChart as LineChartIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterModal, FilterOption } from "@/components/dashboard/FilterModal";
import { useAttendanceStore } from "@/stores/useAttendanceStore";

const COLORS = ["#0088FE", "#FF8042"];

export default function Performance() {
  const [chartType, setChartType] = useState<"bar" | "line">("bar");
  const [filterOption, setFilterOption] = useState("course");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { sessions } = useAttendanceStore();

  // Filter options
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([
    { id: "level-100", label: "Level 100", checked: false, group: "Level" },
    { id: "level-200", label: "Level 200", checked: false, group: "Level" },
    { id: "level-300", label: "Level 300", checked: false, group: "Level" },
    { id: "level-400", label: "Level 400", checked: false, group: "Level" },
    { id: "course-csc101", label: "CSC101", checked: false, group: "Course" },
    { id: "course-csc201", label: "CSC201", checked: false, group: "Course" },
    { id: "course-mth301", label: "MTH301", checked: false, group: "Course" },
    { id: "course-phy101", label: "PHY101", checked: false, group: "Course" },
    {
      id: "session-current",
      label: "2024/2025",
      checked: false,
      group: "Session",
    },
    {
      id: "session-past",
      label: "2023/2024",
      checked: false,
      group: "Session",
    },
  ]);

  // Prepare data for charts
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [studentAttendanceData, setStudentAttendanceData] = useState<any[]>([]);
  const [overallAttendance, setOverallAttendance] = useState<any[]>([]);

  useEffect(() => {
    if (sessions.length === 0) return;

    // Process attendance data by course
    const courseData = sessions.map((session) => {
      const present = session.students.reduce((acc, student) => {
        const presentCount = Object.values(student.attendance).filter(
          (a) => a.status === "present"
        ).length;
        return acc + presentCount;
      }, 0);

      const absent = session.students.reduce((acc, student) => {
        const absentCount = Object.values(student.attendance).filter(
          (a) => a.status === "absent"
        ).length;
        return acc + absentCount;
      }, 0);

      const total = present + absent;
      const presentPercentage =
        total > 0 ? Math.round((present / total) * 100) : 0;
      const absentPercentage =
        total > 0 ? Math.round((absent / total) * 100) : 0;

      return {
        name: session.courseCode,
        present: presentPercentage,
        absent: absentPercentage,
        fullName: session.course,
      };
    });

    // Filter for search
    const filteredCourseData = searchQuery
      ? courseData.filter(
          (course) =>
            course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.fullName.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : courseData;

    setAttendanceData(filteredCourseData);

    // Get weekly attendance data (simplified for demo)
    const weeklyData = Array.from({ length: 6 }, (_, i) => {
      const weekNumber = i + 1;
      // Calculate average attendance for each week
      const attendanceSum = sessions.reduce((acc, session) => {
        const presentCount = session.students.reduce((sum, student) => {
          const dates = Object.keys(student.attendance);
          if (dates.length > i) {
            return student.attendance[dates[i]]?.status === "present"
              ? sum + 1
              : sum;
          }
          return sum;
        }, 0);
        return acc + (presentCount / (session.students.length || 1)) * 100;
      }, 0);

      const averageAttendance = sessions.length
        ? Math.round(attendanceSum / sessions.length)
        : 0;

      return {
        name: `Week ${weekNumber}`,
        attendance: averageAttendance,
      };
    });

    setStudentAttendanceData(weeklyData);

    // Calculate overall attendance
    let totalPresent = 0;
    let totalAbsent = 0;

    sessions.forEach((session) => {
      session.students.forEach((student) => {
        Object.values(student.attendance).forEach((status) => {
          if (status.status === "present") totalPresent++;
          if (status.status === "absent") totalAbsent++;
        });
      });
    });

    const totalAttendance = totalPresent + totalAbsent;
    const presentPercentage =
      totalAttendance > 0
        ? Math.round((totalPresent / totalAttendance) * 100)
        : 0;
    const absentPercentage =
      totalAttendance > 0
        ? Math.round((totalAbsent / totalAttendance) * 100)
        : 0;

    setOverallAttendance([
      { name: "Present", value: presentPercentage },
      { name: "Absent", value: absentPercentage },
    ]);
  }, [sessions, searchQuery]);

  const handleApplyFilters = (updatedFilters: FilterOption[]) => {
    setFilterOptions(updatedFilters);
    toast({
      title: "Filters Applied",
      description: "Your performance data has been filtered.",
    });
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your performance data is being exported.",
    });
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between flex-col md:flex-row md:mt-0 mt-[40px] items-center mb-6">
        <h1 className="text-2xl uppercase font-bold">Performance</h1>
        {/* Chart controls */}
        <div className="flex flex-wrap  mt-[20px] gap-4 w-full md:w-fit mb-6">
          <div className="flex gap-2 w-full md:w-fit">
            <Button
              variant={chartType === "bar" ? "default" : "outline"}
              onClick={() => setChartType("bar")}
              className="gap-2 md:w-fit w-full "
            >
              <BarChartIcon size={16} />
              Bar Chart
            </Button>
            <Button
              variant={chartType === "line" ? "default" : "outline"}
              onClick={() => setChartType("line")}
              className="gap-2 md:w-fit w-full"
            >
              <LineChartIcon size={16} />
              Line Chart
            </Button>
          </div>

          {/* <div className="w-[200px]">
          <Select onValueChange={setFilterOption} defaultValue={filterOption}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Individual Student</SelectItem>
              <SelectItem value="course">Course</SelectItem>
              <SelectItem value="level">Level</SelectItem>
            </SelectContent>
          </Select>
        </div> */}
        </div>
      </div>

      {/* Chart controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* <div className="flex gap-2 w-full md:w-fit">
          <Button 
            variant={chartType === 'bar' ? 'default' : 'outline'} 
            onClick={() => setChartType('bar')}
            className="gap-2 md:w-fit w-full "
          >
            <BarChartIcon size={16} />
            Bar Chart
          </Button>
          <Button 
            variant={chartType === 'line' ? 'default' : 'outline'} 
            onClick={() => setChartType('line')}
            className="gap-2 md:w-fit w-full"
          >
            <LineChartIcon size={16} />
            Line Chart
          </Button>
        </div> */}

        {/* <div className="w-[200px]">
          <Select onValueChange={setFilterOption} defaultValue={filterOption}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Individual Student</SelectItem>
              <SelectItem value="course">Course</SelectItem>
              <SelectItem value="level">Level</SelectItem>
            </SelectContent>
          </Select>
        </div> */}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Main chart */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Attendance by Course</CardTitle>
          </CardHeader>
          <CardContent className="min-h-[400px]">
            <ResponsiveContainer width="100%" height={400}>
              {chartType === "bar" ? (
                <BarChart
                  data={attendanceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      `${value}%`,
                      name === "present" ? "Present" : "Absent",
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="present" fill="#22c55e" name="Present %" />
                  <Bar dataKey="absent" fill="#ef4444" name="Absent %" />
                </BarChart>
              ) : (
                <LineChart
                  data={studentAttendanceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, "Attendance"]} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="attendance"
                    stroke="#0284c7"
                    name="Attendance %"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Attendance percentage card */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Attendance</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center">
            <div className="w-64 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={overallAttendance}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {overallAttendance.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? "#22c55e" : "#ef4444"}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Attendance trends card */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Trends</CardTitle>
          </CardHeader>
          <CardContent className="min-h-[300px]">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={studentAttendanceData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, "Attendance"]} />
                <Line
                  type="monotone"
                  dataKey="attendance"
                  stroke="#0284c7"
                  name="Attendance %"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <FilterModal
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        options={filterOptions}
        onApplyFilters={handleApplyFilters}
        groups={["Level", "Course", "Session"]}
      />
    </DashboardLayout>
  );
}
