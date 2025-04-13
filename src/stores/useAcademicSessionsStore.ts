
import { create } from 'zustand';

export type AcademicSession = {
  id: string;
  sessionName: string;
  startDate: string;
  endDate: string;
};

type AcademicSessionsState = {
  sessions: AcademicSession[];
  isLoading: boolean;
  error: string | null;
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
