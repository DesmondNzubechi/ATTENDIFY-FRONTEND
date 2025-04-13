
import { create } from 'zustand';

export type Course = {
  id: string;
  courseName: string;
  courseCode: string;
  description?: string;
};

type CoursesState = {
  courses: Course[];
  isLoading: boolean;
  error: string | null;
  setCourses: (courses: Course[]) => void;
  addCourse: (course: Course) => void;
  updateCourse: (id: string, course: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
};

export const useCoursesStore = create<CoursesState>((set) => ({
  courses: [],
  isLoading: false,
  error: null,
  setCourses: (courses) => set({ courses }),
  addCourse: (course) => set((state) => ({ 
    courses: [...state.courses, course] 
  })),
  updateCourse: (id, updatedCourse) => set((state) => ({
    courses: state.courses.map(course => 
      course.id === id ? { ...course, ...updatedCourse } : course
    )
  })),
  deleteCourse: (id) => set((state) => ({
    courses: state.courses.filter(course => course.id !== id)
  })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
