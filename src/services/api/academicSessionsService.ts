
import { apiClient } from "./apiClient";

export interface AcademicSession {
  id: string;
  sessionName: string;
  startDate: string;
  endDate: string;
}

export const academicSessionsService = {
  getAllSessions: async () => {
    return await apiClient("/api/v1/acedmicSession/fetchallAcdemicSession");
  },
  
  getSessionById: async (id: string) => {
    return await apiClient(`/api/v1/acedmicSession/fetchAcedemicSessionByID/${id}`);
  },
  
  createSession: async (sessionData: Omit<AcademicSession, "id">) => {
    return await apiClient("/api/v1/acedmicSession/createAcedemicSession", {
      method: "POST",
      body: sessionData
    });
  },
  
  deleteSession: async (id: string) => {
    return await apiClient(`/api/v1/acedmicSession/deleteAcedemicSession/${id}`, {
      method: "DELETE"
    });
  },
  
  deleteAllSessions: async () => {
    return await apiClient("/api/v1/acedmicSession/deleteAllAcedemicSessions", {
      method: "DELETE"
    });
  }
};
