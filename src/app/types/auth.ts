export interface User {
  id: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female';
  email: string;
  mobileNo: string;
  joining_date: string;
  role: 'user' | 'admin';
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  gender: 'male' | 'female';
  email: string;
  mobileNo: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface LoginRequest {
  email: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    email: string;
  };
}

export interface OtpVerificationRequest {
  email: string;
  otp: number;
}

export interface OtpVerificationResponse {
  success: boolean;
  message: string;
  data: {
    info: {
      user: User;
      token: string;
    };
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (email: string) => Promise<void>;
  verifyOtp: (email: string, otp: number) => Promise<User>;
  signup: (userData: SignupRequest) => Promise<void>;
  logout: () => void;
  sendOtp: (email: string) => Promise<void>;
  onLoginSuccess?: (user: User) => void;
}

