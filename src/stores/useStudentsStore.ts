
import { create } from 'zustand';
import { BackendStudent } from '@/types/api';
import { studentsService } from '@/services/api/studentsService';

export type Student = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  registrationNumber: string;
  course: string;
  level: string;
  admissionYear: string;
  avatar: string;
};

type StudentsState = {
  students: Student[];
  isLoading: boolean;
  error: string | null;
  fetchStudents: () => Promise<void>;
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
  fetchStudents: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await studentsService.getAllStudents();
      
      if (response && response.data && response.data.data) {
        const formattedStudents: Student[] = response.data.data.map((student: BackendStudent) => {
          // Split the full name into firstName and lastName (assuming format is "FirstName LastName")
          const nameParts = student.name.split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          
          return {
            id: student._id,
            firstName,
            lastName,
            fullName: student.name,
            email: `${student.name.toLowerCase().replace(/\s+/g, '.')}@example.com`, // Generate mock email
            registrationNumber: student.regNo.toString(),
            course: 'Not Specified', // Not provided in backend response
            level: student.level,
            admissionYear: student.addmissionYear,
            avatar: '/placeholder.svg'
          };
        });
        
        set({ students: formattedStudents });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch students' });
      console.error('Error fetching students:', error);
    } finally {
      set({ isLoading: false });
    }
  },
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
