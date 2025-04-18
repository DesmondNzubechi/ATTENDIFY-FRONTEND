
import React, { createContext, useContext, useState, useEffect } from "react";
import { authService, LoginCredentials, RegisterData } from "@/services/api/authService";
import { useUserStore } from "@/stores/useUserStore";

type AuthContextType = {
  currentUser: any;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<any>;
  register: (userData: RegisterData) => Promise<any>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, isLoading, setUser, setLoading, setError, logout } = useUserStore();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Authentication check failed:', error);
      setUser(null);
      setError(error.message)
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try { 
      setLoading(true);
      const response = await authService.login(credentials);
      setUser(response?.data?.user);
      return response;
    } finally {
      setLoading(false);
    }
  };
 
  const register = async (userData: RegisterData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      setUser(response.user);
      return response;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    logout();
  };

  const value = {
    currentUser,
    isLoading,
    login,
    register,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
