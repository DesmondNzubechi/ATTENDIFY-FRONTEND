
import { create } from 'zustand';
import { BackendCourse } from '@/types/api';
import { coursesService } from '@/services/api/coursesService';

export type Course = {
  id: string;
  courseName: string;
  courseCode: string;
  description?: string;
  level?: string;
  semester?: string;
};

type CoursesState = {
  courses: Course[];
  isLoading: boolean;
  error: string | null;
  fetchCourses: () => Promise<void>;
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
  fetchCourses: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await coursesService.getAllCourses();
      
      if (response && response.data && response.data.data) {
        const formattedCourses: Course[] = response.data.data.map((course: BackendCourse) => ({
          id: course._id,
          courseName: course.courseTitle,
          courseCode: course.courseCode,
          description: `${course.courseTitle} - ${course.semester}`,
          level: course.level,
          semester: course.semester 
        }));
        
        set({ courses: formattedCourses });
      } 
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch courses' });
      console.error('Error fetching courses:', error);
    } finally {
      set({ isLoading: false });
    }
  },
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
