
type RequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
};

// Get JWT token from cookies
const getJwtFromCookie = (): string | null => {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith('jwt=')) {
      return cookie.substring(4);
    }
  }
  return null;
};

export const apiClient = async (endpoint: string, options: RequestOptions = {}) => {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add JWT token from cookie if available
  const jwtToken = getJwtFromCookie();
  if (jwtToken) {
    headers['Authorization'] = `Bearer ${jwtToken}`;
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
