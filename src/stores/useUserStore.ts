
import { create } from 'zustand';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

type UserState = {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  currentUser: null,
  isLoading: true,
  error: null,
  setUser: (user) => set({ currentUser: user }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  logout: () => set({ currentUser: null }),
}));
