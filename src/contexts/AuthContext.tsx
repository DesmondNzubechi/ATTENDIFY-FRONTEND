import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "@/services/api/authService";
import { useUserStore } from "@/stores/useUserStore";

type AuthContextType = {
  currentUser: any;
  isLoading: boolean;
  login: (credentials: any) => Promise<any>;
  register: (userData: any) => Promise<any>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, isLoading, setUser, setLoading, setError, logout, setIsAuthenticated } = useUserStore();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Authentication check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: any) => {
    try { 
      setLoading(true);
      const response = await authService.login(credentials);
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
