import { User, AuthState } from '../types/auth';

// Token storage utilities
export const TOKEN_KEY = 'auth_token';
export const USER_KEY = 'auth_user';

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
};

export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  try {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
};

export const setUser = (user: User): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const removeUser = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_KEY);
};

export const clearAuth = (): void => {
  removeToken();
  removeUser();
};

export const getAuthState = (): AuthState => {
  const token = getToken();
  const user = getUser();
  
  return {
    user,
    token,
    isAuthenticated: !!(token && user),
    isLoading: false,
  };
};

// Token validation
export const isTokenValid = (token: string): boolean => {
  try {
    // Basic JWT structure check
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Decode payload to check expiration
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    return payload.exp > currentTime;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

// API request helper with token
export const getAuthHeaders = (): HeadersInit => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Debug function to check token status
export const debugTokenStatus = () => {
  if (typeof window === 'undefined') {
    console.log('❌ Running on server side - no localStorage access');
    return;
  }
  
  const token = getToken();
  const user = getUser();
  
  console.log('🔍 === TOKEN DEBUG INFO ===');
  console.log('🎫 Token from localStorage:', token);
  console.log('👤 User from localStorage:', user);
  console.log('✅ Token exists:', !!token);
  console.log('✅ User exists:', !!user);
  console.log('✅ Token valid:', token ? isTokenValid(token) : false);
  
  if (token) {
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        console.log('📋 Token payload:', payload);
        console.log('⏰ Token expires at:', new Date(payload.exp * 1000));
        console.log('⏰ Current time:', new Date());
        console.log('⏰ Token expired:', payload.exp < Math.floor(Date.now() / 1000));
      }
    } catch (error) {
      console.log('❌ Error parsing token:', error);
    }
  }
  
  console.log('🔍 === END DEBUG INFO ===');
  
  return { token, user, isValid: token ? isTokenValid(token) : false };
};

