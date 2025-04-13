
import React, { createContext, useContext, useEffect } from 'react';
import { authService } from '@/services/api/authService';
import { useUserStore } from '@/stores/useUserStore';

interface AuthContextType {
  currentUser: any | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (userData: any) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, isLoading, setUser, setLoading, logout: clearUser } = useUserStore();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        const response = await authService.getCurrentUser();
        setUser(response.user);
      } catch (error) {
        console.error('Authentication check failed:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [setUser, setLoading]);

  const login = async (credentials: any) => {
    try { 
      setLoading(true);
      const response = await authService.login(credentials);
      console.log("the response of sign up", response);
      setUser(response?.data?.user);
      return response;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      console.log("the response of sign up", response);
     // setUser(response.user);
      return response;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      clearUser();
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    isLoading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
