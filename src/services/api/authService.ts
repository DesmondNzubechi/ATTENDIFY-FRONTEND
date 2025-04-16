
import { apiClient } from "./apiClient";

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  fullName: string;
  confirmPassword: string;
}

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await apiClient("/api/v1/auth/login", {
      method: "POST",
      body: credentials
    });
    
    if (response.token) {
      localStorage.setItem("auth_token", response.token);
    }
    
    return response;
  },
   
  register: async (userData: RegisterData) => {
    return await apiClient("/api/v1/auth/register", {
      method: "POST",
      body: userData
    });
  },
  
  getCurrentUser: async () => {
    return await apiClient("/api/v1/auth/fetchMe");
  },
  
  updateProfile: async (userData: {newFullName: string, newEmail: string}) => {
    return await apiClient("/api/v1/auth/updateMe", {
      method: "PATCH",
      body: userData
    });
  },
  
  changePassword: async (passwordData: { currentPassword: string; newPassword: string, confirmNewPassword: string }) => {
    return await apiClient("/api/v1/auth/changePassword", {
      method: "PATCH",
      body: passwordData
    });
  },
  
  forgotPassword: async (email: string) => {
    return await apiClient("/api/v1/auth/forgotPassword", {
      method: "POST",
      body: { email }
    });
  },
  
  resetPassword: async (token: string, newPassword: string) => {
    return await apiClient(`/api/v1/auth/resetPassword/${token}`, {
      method: "PATCH",
      body: { newPassword }
    });
  },
  
  verifyEmail: async (token: string) => {
    return await apiClient("/api/v1/auth/verifyEmail", {
      method: "PATCH",
      body: { token }
    });
  },
  
  logout: async () => {
    localStorage.removeItem("auth_token");
    return await apiClient("/api/v1/auth/logout", {
      method: "POST"
    });
  },
  
  makeUserAdmin: async (userId: string) => {
    return await apiClient(`/api/v1/auth/makeUserAdmin/${userId}`, {
      method: "PATCH"
    });
  }
};
