
import { create } from 'zustand';
import { BackendAcademicSession } from '@/types/api';
import { academicSessionsService } from '@/services/api/academicSessionsService';

export type AcademicSession = {
  id: string;
  sessionName: string;
  startDate: string;
  endDate: string;
  semesters: string[];
  isActive: boolean;
};

type AcademicSessionsState = {
  sessions: AcademicSession[];
  isLoading: boolean;
  error: string | null;
  fetchSessions: () => Promise<void>;
  setSessions: (sessions: AcademicSession[]) => void;
  addSession: (session: AcademicSession) => void;
  updateSession: (id: string, session: Partial<AcademicSession>) => void;
  deleteSession: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
};

export const useAcademicSessionsStore = create<AcademicSessionsState>((set) => ({
  sessions: [],
  isLoading: false,
  error: null,
  fetchSessions: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await academicSessionsService.getAllSessions();
      
      if (response && response.data && response.data.data) {
        const formattedSessions: AcademicSession[] = response.data.data.map((session: BackendAcademicSession) => ({
          id: session._id,
          sessionName: session.name,
          startDate: session.start,
          endDate: session.end,
          semesters: session.semesters,
          isActive: session.active
        }));
        
        set({ sessions: formattedSessions });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch academic sessions' });
      console.error('Error fetching academic sessions:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  setSessions: (sessions) => set({ sessions }),
  addSession: (session) => set((state) => ({ 
    sessions: [...state.sessions, session] 
  })),
  updateSession: (id, updatedSession) => set((state) => ({
    sessions: state.sessions.map(session => 
      session.id === id ? { ...session, ...updatedSession } : session
    )
  })),
  deleteSession: (id) => set((state) => ({
    sessions: state.sessions.filter(session => session.id !== id)
  })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
