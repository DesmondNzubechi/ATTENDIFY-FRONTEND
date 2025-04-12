
import { toast } from "@/hooks/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

interface RequestOptions {
  method: string;
  headers?: Record<string, string>;
  body?: any;
}

export const apiClient = async (endpoint: string, options: RequestOptions = { method: "GET" }) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers
  };
  
  // Add authentication token if available
  const token = localStorage.getItem("auth_token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const config: RequestInit = {
    method: options.method,
    headers,
    credentials: "include"
  };
  
  if (options.body) {
    config.body = JSON.stringify(options.body);
  }
  
  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "An error occurred" }));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
    
    // For DELETE requests that don't return content
    if (response.status === 204) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    toast({
      title: "API Error",
      description: errorMessage,
      variant: "destructive"
    });
    throw error;
  }
};
