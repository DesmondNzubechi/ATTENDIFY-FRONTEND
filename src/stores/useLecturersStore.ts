
import { create } from 'zustand';
import { BackendLecturer } from '@/types/api';
import { fetchLecturers, createLecturer, updateLecturer, deleteLecturer } from '@/services/api/lecturersService';

export interface Lecturer {
  id: string;
  name: string;
  email: string;
  faculty: string;
  department: string;
  avatar: string;
}

// Transform backend lecturer to frontend format
const transformLecturer = (backendLecturer: BackendLecturer): Lecturer => ({
  id: backendLecturer._id,
  name: backendLecturer.fullName,
  email: backendLecturer.email,
  faculty: 'Engineering', // Default as per requirements
  department: 'Electrical', // Default as per requirements
  avatar: '/placeholder.svg'
});

type LecturersState = {
  lecturers: Lecturer[];
  isLoading: boolean;
  error: string | null;
  fetchAllLecturers: () => Promise<void>;
  addLecturer: (lecturerData: { fullName: string, email: string }) => Promise<Lecturer | null>;
  updateLecturer: (id: string, lecturerData: Partial<{ fullName: string, email: string }>) => Promise<void>;
  deleteLecturer: (id: string) => Promise<void>;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
};

export const useLecturersStore = create<LecturersState>((set, get) => ({
  lecturers: [],
  isLoading: false,
  error: null,

  fetchAllLecturers: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetchLecturers();
      
      if (response.status === 'success') {
        const transformedLecturers = response.data.data
          .filter(lecturer => lecturer.role === 'lecturer')
          .map(transformLecturer);
        
        set({ lecturers: transformedLecturers });
      } else {
        set({ error: response.message || 'Failed to fetch lecturers' });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
    } finally {
      set({ isLoading: false });
    }
  },

  addLecturer: async (lecturerData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await createLecturer(lecturerData);
      
      if (response.status === 'success' && response.data.data.length > 0) {
        const newLecturer = transformLecturer(response.data.data[0]);
        set(state => ({ 
          lecturers: [...state.lecturers, newLecturer] 
        }));
        return newLecturer;
      } else {
        set({ error: response.message || 'Failed to add lecturer' });
        return null;
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  updateLecturer: async (id, lecturerData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await updateLecturer(id, lecturerData);
      
      if (response.status === 'success' && response.data.data.length > 0) {
        const updatedLecturer = transformLecturer(response.data.data[0]);
        set(state => ({
          lecturers: state.lecturers.map(lecturer => 
            lecturer.id === id ? updatedLecturer : lecturer
          )
        }));
      } else {
        set({ error: response.message || 'Failed to update lecturer' });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteLecturer: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const response = await deleteLecturer(id);
      
      if (response.status === 'success') {
        set(state => ({
          lecturers: state.lecturers.filter(lecturer => lecturer.id !== id)
        }));
      } else {
        set({ error: response.message || 'Failed to delete lecturer' });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
    } finally {
      set({ isLoading: false });
    }
  },

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
