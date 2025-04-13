
import { create } from 'zustand';

export type Lecturer = {
  id: string;
  name: string;
  email: string;
  faculty: string;
  department: string;
  avatar: string;
};

type LecturersState = {
  lecturers: Lecturer[];
  isLoading: boolean;
  error: string | null;
  setLecturers: (lecturers: Lecturer[]) => void;
  addLecturer: (lecturer: Lecturer) => void;
  updateLecturer: (id: string, lecturer: Partial<Lecturer>) => void;
  deleteLecturer: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
};

export const useLecturersStore = create<LecturersState>((set) => ({
  lecturers: [],
  isLoading: false,
  error: null,
  setLecturers: (lecturers) => set({ lecturers }),
  addLecturer: (lecturer) => set((state) => ({ 
    lecturers: [...state.lecturers, lecturer] 
  })),
  updateLecturer: (id, updatedLecturer) => set((state) => ({
    lecturers: state.lecturers.map(lecturer => 
      lecturer.id === id ? { ...lecturer, ...updatedLecturer } : lecturer
    )
  })),
  deleteLecturer: (id) => set((state) => ({
    lecturers: state.lecturers.filter(lecturer => lecturer.id !== id)
  })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
