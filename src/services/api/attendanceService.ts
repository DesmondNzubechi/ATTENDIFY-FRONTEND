
import { apiClient } from "./apiClient";
import { ApiResponse, BackendAttendance, AttendanceStatus } from "@/types/api";

export interface AttendanceRecord {
  id: string;
  studentId: string;
  course: string;
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

export interface CreateAttendanceData {
  course: string;
  acedemicSession: string;
  semester: string;
  level: string; 
}

export interface MarkAttendanceData {
  studentId?: string;
  status?: string;
  level: string;
  regNo: string; 
}
 
export const attendanceService = {
  getAllAttendance: async (): Promise<ApiResponse<BackendAttendance>> => {
    return await apiClient("/api/v1/attendance/fetchAllAttendance");
  },
   
  getAttendanceBySession: async (sessionId: string): Promise<ApiResponse<BackendAttendance>> => {
    return await apiClient(`/api/v1/attendance/fetchAttendanceBySession/${sessionId}`);
  },
  
  createAttendance: async (attendanceData: CreateAttendanceData): Promise<ApiResponse<BackendAttendance>> => {
    return await apiClient("/api/v1/attendance/createAttendance", {
      method: "POST",
      body: attendanceData
    });
  },
  
  activateAttendance: async (attendanceId: string): Promise<ApiResponse<BackendAttendance>> => {
    return await apiClient(`/api/v1/attendance/activateAttendance/${attendanceId}`, {
      method: "PATCH"
    });
  },
  
  deactivateAttendance: async (attendanceId: string): Promise<ApiResponse<BackendAttendance>> => {
    return await apiClient(`/api/v1/attendance/deactivateAttendance/${attendanceId}`, {
      method: "PATCH"
    });
  },
  
  markAttendance: async (attendanceId: string, data: MarkAttendanceData): Promise<ApiResponse<BackendAttendance>> => {
    return await apiClient(`/api/v1/attendance/markAttendance/${attendanceId}`, {
      method: "PATCH",
      body: data
    });
  },
  
  markAbsent: async (attendanceId: string, data: MarkAttendanceData): Promise<ApiResponse<BackendAttendance>> => {
    return await apiClient(`/api/v1/attendance/markAbsent/${attendanceId}`, {
      method: "PATCH",
      body: data
    });
  },
    
  deleteAttendance: async (attendanceId: string): Promise<ApiResponse<any>> => {
    return await apiClient(`/api/v1/attendance/deleteAttendance/${attendanceId}`, {
      method: "DELETE"
    });
  },
  
  deleteAllAttendance: async (): Promise<ApiResponse<any>> => {
    return await apiClient("/api/v1/attendance/deleteAllAttendance", {
      method: "DELETE"
    });
  }
}; 
