import { create } from "zustand";
import { BackendAttendance, StudentAttendance } from "@/types/api";
import { attendanceService } from "@/services/api/attendanceService";

export type AttendanceStudent = {
  id: string;
  name: string;
  registrationNumber: string;
  attendance:
    | Record<
        string,
        { status: "present" | "absent" | "not-marked"; time?: string }
      >
    | any;
};

export type AttendanceSession = {
  id: string;
  course: string;
  courseCode: string;
  level: string;
  sessionName: string;
  date: string;
  isActive: boolean;
  semester: string;
  students: AttendanceStudent[];
};

type AttendanceState = {
  sessions: AttendanceSession[];
  selectedSession: AttendanceSession | null;
  isLoading: boolean;
  error: string | null;
  fetchAttendance: () => Promise<void>;
  setSessions: (sessions: AttendanceSession[]) => void;
  setSelectedSession: (session: AttendanceSession | null) => void;
  addSession: (session: AttendanceSession) => void;
  updateSession: (id: string, session: Partial<AttendanceSession>) => void;
  markAttendance: (
    sessionId: string,
    studentId: string,
    status: "present" | "absent"
  ) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  activateSession: (sessionId: string) => Promise<void>;
  deactivateSession: (sessionId: string) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  createAttendance: (data: {
    courseId: string;
    acedemicSessionId: string;
    semester: string;
    level: string;
  }) => Promise<void>;
};

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  sessions: [],
  selectedSession: null,
  isLoading: false,
  error: null,
  fetchAttendance: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await attendanceService.getAllAttendance();

      if (response && response.data && response.data.data) {
        const formattedSessions: AttendanceSession[] = response.data.data.map(
          (attendance: BackendAttendance) => {
            // Format students data
            const formattedStudents: AttendanceStudent[] =
              attendance.students.map((student: StudentAttendance) => {
                // Create attendance record for each student
                const attendanceRecord: Record<
                  string,
                  { status: "present" | "absent" | "not-marked"; time?: string }
                > = {};

                student.attendanceStatus.forEach((status) => {
                  const date = new Date(status.date)
                    .toISOString()
                    .split("T")[0];
                  const time = new Date(status.date).toLocaleTimeString();
                  attendanceRecord[date] = {
                    status: status.status as "present" | "absent",
                    time,
                  };
                });

                return {
                  id: student.studentId,
                  name: student.name,
                  registrationNumber: student.regNo,
                  attendance: attendanceRecord,
                };
              });

            return {
              id: attendance._id,
              course: attendance.course.courseTitle,
              courseCode: attendance.course.courseCode,
              level: attendance.level,
              sessionName: attendance.acedemicSession.name,
              date: attendance.createdAt,
              isActive: attendance.active,
              semester: attendance.semester,
              students: formattedStudents,
            };
          }
        );

        set({ sessions: formattedSessions });
      }
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch attendance",
      });
      console.error("Error fetching attendance:", error);
    } finally {
      set({ isLoading: false });
    }
  },
  setSessions: (sessions) => set({ sessions }),
  setSelectedSession: (session) => set({ selectedSession: session }),
  addSession: (session) =>
    set((state) => ({
      sessions: [...state.sessions, session],
    })),
  updateSession: (id, updatedSession) =>
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === id ? { ...session, ...updatedSession } : session
      ),
      selectedSession:
        state.selectedSession?.id === id
          ? { ...state.selectedSession, ...updatedSession }
          : state.selectedSession,
    })),
  markAttendance: (sessionId, studentId, status) =>
    set((state) => {
      const today = new Date().toISOString().split("T")[0];
      const time = new Date().toLocaleTimeString();

      // Update sessions array
      const updatedSessions = state.sessions.map((session) => {
        if (session.id !== sessionId) return session;

        const updatedStudents = session.students.map((student) => {
          if (student.id !== studentId) return student;

          return {
            ...student,
            attendance: {
              ...student.attendance,
              [today]: { status, time },
            },
          };
        });

        return {
          ...session,
          students: updatedStudents,
        };
      });

      // Update selectedSession if it's the one being modified
      let updatedSelectedSession = state.selectedSession;
      if (state.selectedSession?.id === sessionId) {
        const updatedStudents = state.selectedSession.students.map(
          (student) => {
            if (student.id !== studentId) return student;

            return {
              ...student,
              attendance: {
                ...student.attendance,
                [today]: { status, time },
              },
            };
          }
        );

        updatedSelectedSession = {
          ...state.selectedSession,
          students: updatedStudents,
        };
      }

      return {
        sessions: updatedSessions,
        selectedSession: updatedSelectedSession,
      };
    }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  // New methods for attendance management
  activateSession: async (sessionId) => {
    const { updateSession, setError } = get();
    try {
      await attendanceService.activateAttendance(sessionId);
      updateSession(sessionId, { isActive: true });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to activate session"
      );
      throw error;
    }
  },

  deactivateSession: async (sessionId) => {
    const { updateSession, setError } = get();
    try {
      await attendanceService.deactivateAttendance(sessionId);
      updateSession(sessionId, { isActive: false });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to deactivate session"
      );
      throw error;
    }
  },

  deleteSession: async (sessionId) => {
    const { setError } = get();
    try {
      await attendanceService.deleteAttendance(sessionId);
      set((state) => ({
        sessions: state.sessions.filter((session) => session.id !== sessionId),
        selectedSession:
          state.selectedSession?.id === sessionId
            ? null
            : state.selectedSession,
      }));
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete session"
      );
      throw error;
    }
  },

  createAttendance: async (data) => {
    const { fetchAttendance, setError, setLoading } = get();
    try {
      setLoading(true);
      await attendanceService.createAttendance(data);
      await fetchAttendance(); // Refresh the attendance data
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create attendance"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  },
}));
