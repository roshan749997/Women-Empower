// Authenticated API helper functions
import { getToken, getUser } from './authApi';

// Helper function to get authenticated headers
export const getAuthenticatedHeaders = (): HeadersInit => {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Helper function to make authenticated API calls
export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const headers = getAuthenticatedHeaders();
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });
  
  return response;
};

// Helper function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getToken();
  const user = getUser();
  return !!(token && user);
};

// Helper function to get current user
export const getCurrentUser = () => {
  return getUser();
};

// Helper function to get current token
export const getCurrentToken = (): string | null => {
  return getToken();
};
