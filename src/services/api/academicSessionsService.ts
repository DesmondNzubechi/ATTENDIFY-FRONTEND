
import { apiClient } from "./apiClient";
import { ApiResponse, BackendAcademicSession } from "@/types/api";

export interface AcademicSession {
  id: string;
  sessionName: string;
  startDate: string;
  endDate: string;
}

export const academicSessionsService = {
  getAllSessions: async (): Promise<ApiResponse<BackendAcademicSession>> => {
    return await apiClient("/api/v1/acedmicSession/fetchallAcdemicSession");
  },
  
  getSessionById: async (id: string): Promise<ApiResponse<BackendAcademicSession>> => {
    return await apiClient(`/api/v1/acedmicSession/fetchAcedemicSessionByID/${id}`);
  },
  
  createSession: async (sessionData: Omit<AcademicSession, "id">): Promise<ApiResponse<BackendAcademicSession>> => {
    return await apiClient("/api/v1/acedmicSession/createAcedemicSession", {
      method: "POST",
      body: sessionData
    });
  },
  
  deleteSession: async (id: string): Promise<ApiResponse<any>> => {
    return await apiClient(`/api/v1/acedmicSession/deleteAcedemicSession/${id}`, {
      method: "DELETE"
    });
  },
  
  deleteAllSessions: async (): Promise<ApiResponse<any>> => {
    return await apiClient("/api/v1/acedmicSession/deleteAllAcedemicSessions", {
      method: "DELETE"
    });
  }
};
