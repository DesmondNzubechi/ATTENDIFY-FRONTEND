
import { apiClient } from "./apiClient";

export interface AttendanceRecord {
  id: string;
  studentId: string;
  courseId: string;
  sessionId: string;
  date: string;
  status: 'present' | 'absent' | 'not-marked';
  time?: string;
}

export interface AttendanceSession {
  id: string;
  date: string;
  course: string;
  level: string;
  sessionName: string;
  isActive: boolean;
  students: Array<{
    id: string;
    name: string;
    registrationNumber: string;
    attendance: {
      [date: string]: {
        status: 'present' | 'absent' | 'not-marked';
        time?: string;
      }
    }
  }>;
}

export const attendanceService = {
  getAllAttendance: async () => {
    return await apiClient("/api/v1/attendance/fetchAllAttendance");
  },
  
  getAttendanceBySession: async (sessionId: string) => {
    return await apiClient(`/api/v1/attendance/fetchAttendanceBySession/${sessionId}`);
  },
  
  createAttendance: async (attendanceData: any) => {
    return await apiClient("/api/v1/attendance/createAttendance", {
      method: "POST",
      body: attendanceData
    });
  },
  
  activateAttendance: async (attendanceId: string) => {
    return await apiClient(`/api/v1/attendance/activateAttendance/${attendanceId}`, {
      method: "PATCH"
    });
  },
  
  deactivateAttendance: async (attendanceId: string) => {
    return await apiClient(`/api/v1/attendance/deactivateAttendance/${attendanceId}`, {
      method: "PATCH"
    });
  },
  
  markAttendance: async (attendanceId: string, data: any) => {
    return await apiClient(`/api/v1/attendance/markAttendance/${attendanceId}`, {
      method: "PATCH",
      body: data
    });
  },
  
  markAbsent: async (attendanceId: string) => {
    return await apiClient(`/api/v1/attendance/markAbsent/${attendanceId}`, {
      method: "PATCH"
    });
  },
  
  deleteAttendance: async (attendanceId: string) => {
    return await apiClient(`/api/v1/attendance/deleteAttendance/${attendanceId}`, {
      method: "DELETE"
    });
  },
  
  deleteAllAttendance: async () => {
    return await apiClient("/api/v1/attendance/deleteAllAttendance", {
      method: "DELETE"
    });
  }
};
