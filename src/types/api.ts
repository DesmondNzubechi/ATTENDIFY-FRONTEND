
// API Response Types
export interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: {
    data: T[];
  };
}

// Course Types
export interface BackendCourse {
  _id: string;
  courseTitle: string;
  courseCode: string;
  semester: string;
  level: string;
  __v?: number;
}

// Student Types
export interface BackendStudent {
  _id: string;
  name: string;
  regNo: number;
  level: string;
  addmissionYear: string;
  fingerPrint: string;
  __v?: number;
}

// Attendance Types
export interface AttendanceStatus {
  date: string;
  status: "present" | "absent";
  _id: string;
}

export interface StudentAttendance {
  studentId: string;
  name: string;
  regNo: string;
  level: string;
  fingerPrint: string;
  addmissionYear: string;
  attendanceStatus: AttendanceStatus[];
  _id: string;
}

export interface CourseAttendance {
  _id: string;
  courseTitle: string;
  courseCode: string;
  semester: string;
  level: string;
  __v?: number;
}

export interface AcademicSessionAttendance {
  active: boolean;
  _id: string;
  name: string;
  start: string;
  end: string;
  semesters: string[];
  attendance: any[];
  __v?: number;
}

export interface BackendAttendance {
  _id: string;
  course: CourseAttendance;
  acedemicSession: AcademicSessionAttendance;
  semester: string;
  level: string;
  active: boolean;
  students: StudentAttendance[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Academic Session Types
export interface BackendAcademicSession {
  active: boolean;
  _id: string;
  name: string;
  start: string;
  end: string;
  semesters: string[];
  attendance: any[];
  __v?: number;
}
