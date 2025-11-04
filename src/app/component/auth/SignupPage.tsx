'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Shield, 
  Person,
  Email,
  Phone,
  CheckCircle,
  Error as ErrorIcon,
  ArrowBack
} from '@mui/icons-material';

// Import sub-components
import LoginSignup from '@/app/LoginSignup/page';

// Import AuthContext
import { useAuth } from '@/app/contexts/AuthContext';

const SignupPage: React.FC = () => {
  const { user, isAuthenticated, isLoading, signup } = useAuth();
  const router = useRouter();
  
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [emailAddress, setEmailAddress] = useState('');
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    gender: 'male' as 'male' | 'female',
    email: '',
    mobileNo: ''
  });

  // Redirect already logged-in users
  useEffect(() => {
    if (user && !isLoading) {
      if (user.role === 'admin') {
        console.log('🔄 Admin user detected, redirecting to dashboard');
        window.location.href = "/dashboardmaintab";
      } else {
        console.log('🔄 Regular user detected, redirecting to home');
        router.push('/');
      }
    }
  }, [user, isLoading, router]);

  const handleEmailLogin = async () => {
    // This function is not used in signup mode, but required by LoginSignup component
  };

  const handleOtpVerification = async () => {
    // This function is not used in signup mode, but required by LoginSignup component
  };

  const handleOtpChange = (index: number, value: string) => {
    // This function is not used in signup mode, but required by LoginSignup component
  };

  const handleInputChange = (field: string, value: string) => {
    setSignupData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSignup = async () => {
    // Validate form
    if (!signupData.firstName || !signupData.lastName || !signupData.email || !signupData.mobileNo) {
      setError('Please fill all required fields');
      return;
    }
    
    if (!signupData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (signupData.mobileNo.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);
    
    try {
      await signup(signupData);
      setSuccess('Account created successfully! Please login with your email.');
      
      // Reset form
      setSignupData({
        firstName: '',
        lastName: '',
        gender: 'male',
        email: '',
        mobileNo: ''
      });
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      
    } catch (error: any) {
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#61503c] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Signup Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Error/Success Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}
        
        <LoginSignup
          authMode={authMode}
          setAuthMode={setAuthMode}
          emailAddress={emailAddress}
          setEmailAddress={setEmailAddress}
          showOtpVerification={showOtpVerification}
          setShowOtpVerification={setShowOtpVerification}
          otp={otp}
          setOtp={setOtp}
          signupData={signupData}
          setSignupData={setSignupData}
          handleEmailLogin={handleEmailLogin}
          handleOtpVerification={handleOtpVerification}
          handleOtpChange={handleOtpChange}
          handleSignup={handleSignup}
          handleResendOtp={() => {
            // Reset OTP and resend
            setOtp(['', '', '', '', '', '']);
            handleEmailLogin();
          }}
        />
      </div>
    </div>
  );
};

export default SignupPage;
