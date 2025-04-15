
import { apiClient } from "./apiClient";
import { ApiResponse, BackendAcademicSession } from "@/types/api";

export interface AcademicSession {
  id: string;
  sessionName: string;
  startDate: string;
  endDate: string;
}

export interface addSessionData{
  name: string;
  start: string;
  end: string;
}
 
export const academicSessionsService = {
  getAllSessions: async (): Promise<ApiResponse<BackendAcademicSession>> => {
    return await apiClient("/api/v1/acedemicSession/fetchallAcedemicSession");
  },
    
  getSessionById: async (id: string): Promise<ApiResponse<BackendAcademicSession>> => {
    return await apiClient(`/api/v1/acedemicSession/fetchAcedemicSessionByID/${id}`);
  },
   
  createSession: async (sessionData: addSessionData): Promise<ApiResponse<BackendAcademicSession>> => {
    return await apiClient("/api/v1/acedemicSession/createAcedemicSession", {
      method: "POST",
      body: sessionData
    });
  },
    
  deleteSession: async (id: string): Promise<ApiResponse<any>> => {
    return await apiClient(`/api/v1/acedemicSession/deleteAcedemicSession/${id}`, {
      method: "DELETE"
    });
  },
  
  deleteAllSessions: async (): Promise<ApiResponse<any>> => {
    return await apiClient("/api/v1/acedemicSession/deleteAllAcedemicSessions", {
      method: "DELETE"
    });
  }
};
