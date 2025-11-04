"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getAuthState, clearAuth, isTokenValid, saveToken, saveUser } from "../lib/authApi";
import { registerUser, sendLoginOtp, verifyOtp, getCurrentUser } from "../lib/authApi";
import { User, SignupRequest, AuthContextType, AuthState } from "../types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const initializeAuth = () => {
      console.log('🚀 Initializing auth state...');
      const state = getAuthState();
      
      if (state.token && !isTokenValid(state.token)) {
        console.log('⚠️ Token expired, clearing auth data');
        clearAuth();
        setAuthState({ user: null, token: null, isAuthenticated: false, isLoading: false });
        return;
      }

      console.log('✅ Auth state initialized:', {
        isAuthenticated: state.isAuthenticated,
        hasUser: !!state.user,
        hasToken: !!state.token
      });
      
      setAuthState({ ...state, isLoading: false });
    };

    initializeAuth();
  }, []);

  const signup = async (userData: SignupRequest): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await registerUser(userData);
      if (response.success) {
        // User registered successfully, but not logged in yet
        console.log('User registered successfully:', response.data);
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const sendOtp = async (email: string): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await sendLoginOtp(email);
      if (response.success) {
        console.log('OTP sent successfully to:', email);
      } else {
        throw new Error(response.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      throw error;
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const verifyOtpAndLogin = async (email: string, otp: number): Promise<User> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await verifyOtp(email, otp);
      if (response.success) {
        const { user, token } = response.data.info;
        
        // Save token and user to localStorage and update state
        saveToken(token);
        saveUser(user);
        
        // Fetch complete user profile from API
        try {
          const profileResponse = await getCurrentUser(user.id);
          if (profileResponse.success) {
            const completeUser = profileResponse.data;
            saveUser(completeUser); // Save complete user profile
            console.log('Complete user profile loaded:', completeUser);
          }
        } catch (profileError) {
          console.warn('Could not fetch complete profile, using basic user data:', profileError);
        }
        
        // Update auth state
        setAuthState({
          user: user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
        
        console.log('✅ Auth state updated:', {
          user: user?.email,
          token: token ? token.substring(0, 20) + '...' : 'null',
          isAuthenticated: true
        });
        
        // Return user data for role-based routing
        return user;
      } else {
        throw new Error(response.message || 'OTP verification failed');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const login = async (email: string): Promise<void> => {
    await sendOtp(email);
  };

  const logout = (): void => {
    console.log('🚪 User logging out...');
    clearAuth();
    setAuthState({ user: null, token: null, isAuthenticated: false, isLoading: false });
    console.log('✅ Logout completed');
  };

  const value: AuthContextType = {
    ...authState,
    signup,
    login,
    verifyOtp: verifyOtpAndLogin,
    sendOtp,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

