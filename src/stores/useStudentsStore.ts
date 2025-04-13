
import { create } from 'zustand';

export type Student = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  registrationNumber: string;
  course: string;
  avatar: string;
};

type StudentsState = {
  students: Student[];
  isLoading: boolean;
  error: string | null;
  setStudents: (students: Student[]) => void;
  addStudent: (student: Student) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
};

export const useStudentsStore = create<StudentsState>((set) => ({
  students: [],
  isLoading: false,
  error: null,
  setStudents: (students) => set({ students }),
  addStudent: (student) => set((state) => ({ 
    students: [...state.students, student] 
  })),
  updateStudent: (id, updatedStudent) => set((state) => ({
    students: state.students.map(student => 
      student.id === id ? { ...student, ...updatedStudent } : student
    )
  })),
  deleteStudent: (id) => set((state) => ({
    students: state.students.filter(student => student.id !== id)
  })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
