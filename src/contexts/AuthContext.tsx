
import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "@/services/api/authService";
import { useUserStore } from "@/stores/useUserStore";

type AuthContextType = {
  currentUser: any;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (userData: any) => Promise<any>;
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
      console.error("Authentication check failed:", error);
      setError("Failed to authenticate");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userData = await authService.login(email, password);
      setUser(userData);
      return userData;
    } catch (error) {
      setError("Login failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setLoading(true);
      const newUser = await authService.register(userData);
      setUser(newUser);
      return newUser;
    } catch (error) {
      setError("Registration failed");
      throw error;
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
