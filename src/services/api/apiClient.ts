
type RequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
};

// Get JWT token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem("auth_token");
};

export const apiClient = async (endpoint: string, options: RequestOptions = {}) => {
  const baseUrl = import.meta.env.VITE_API_URL;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add auth token from localStorage if available
  const authToken = getAuthToken();
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const requestOptions: RequestInit = {
    method: options.method || 'GET',
    headers,
    credentials: 'include', // Include cookies in requests
  };

  if (options.body) {
    requestOptions.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, requestOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.statusText}`);
    }
    
    // For HEAD and DELETE requests which may not return data
    if (options.method === 'HEAD' || options.method === 'DELETE') {
      return { ok: true, status: response.status };
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};
