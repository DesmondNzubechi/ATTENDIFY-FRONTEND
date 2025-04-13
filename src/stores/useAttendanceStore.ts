
import { create } from 'zustand';

export type AttendanceStudent = {
  id: string;
  name: string;
  registrationNumber: string;
  attendance: Record<string, { status: 'present' | 'absent' | 'not-marked', time?: string }>;
};

export type AttendanceSession = {
  id: string;
  course: string;
  level: string;
  sessionName: string;
  date: string;
  isActive: boolean;
  students: AttendanceStudent[];
};

type AttendanceState = {
  sessions: AttendanceSession[];
  selectedSession: AttendanceSession | null;
  isLoading: boolean;
  error: string | null;
  setSessions: (sessions: AttendanceSession[]) => void;
  setSelectedSession: (session: AttendanceSession | null) => void;
  addSession: (session: AttendanceSession) => void;
  updateSession: (id: string, session: Partial<AttendanceSession>) => void;
  markAttendance: (sessionId: string, studentId: string, status: 'present' | 'absent') => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
};

export const useAttendanceStore = create<AttendanceState>((set) => ({
  sessions: [],
  selectedSession: null,
  isLoading: false,
  error: null,
  setSessions: (sessions) => set({ sessions }),
  setSelectedSession: (session) => set({ selectedSession: session }),
  addSession: (session) => set((state) => ({ 
    sessions: [...state.sessions, session] 
  })),
  updateSession: (id, updatedSession) => set((state) => ({
    sessions: state.sessions.map(session => 
      session.id === id ? { ...session, ...updatedSession } : session
    ),
    selectedSession: state.selectedSession?.id === id 
      ? { ...state.selectedSession, ...updatedSession } 
      : state.selectedSession
  })),
  markAttendance: (sessionId, studentId, status) => set((state) => {
    const today = new Date().toISOString().split('T')[0];
    const time = new Date().toLocaleTimeString();
    
    // Update sessions array
    const updatedSessions = state.sessions.map(session => {
      if (session.id !== sessionId) return session;
      
      const updatedStudents = session.students.map(student => {
        if (student.id !== studentId) return student;
        
        return {
          ...student,
          attendance: {
            ...student.attendance,
            [today]: { status, time }
          }
        };
      });
      
      return {
        ...session,
        students: updatedStudents
      };
    });
    
    // Update selectedSession if it's the one being modified
    let updatedSelectedSession = state.selectedSession;
    if (state.selectedSession?.id === sessionId) {
      const updatedStudents = state.selectedSession.students.map(student => {
        if (student.id !== studentId) return student;
        
        return {
          ...student,
          attendance: {
            ...student.attendance,
            [today]: { status, time }
          }
        };
      });
      
      updatedSelectedSession = {
        ...state.selectedSession,
        students: updatedStudents
      };
    }
    
    return {
      sessions: updatedSessions,
      selectedSession: updatedSelectedSession
    };
  }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
