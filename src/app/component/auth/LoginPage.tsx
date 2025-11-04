'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Shield, 
  Email,
  Lock,
  CheckCircle,
  Error as ErrorIcon
} from '@mui/icons-material';

// Import sub-components
import LoginSignup from '@/app/LoginSignup/page';

// Import AuthContext
import { useAuth } from '@/app/contexts/AuthContext';

const LoginPage: React.FC = () => {
  const { user, isAuthenticated, isLoading, signup, sendOtp, verifyOtp } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const returnUrl = searchParams?.get('returnUrl');
  
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [emailAddress, setEmailAddress] = useState('');
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Signup form states
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
        const target = returnUrl && returnUrl.startsWith('/') ? returnUrl : '/';
        console.log('🔄 Regular user detected, redirecting to:', target);
        router.push(target);
      }
    }
  }, [user, isLoading, returnUrl, router]);

  const handleEmailLogin = async () => {
    if (emailAddress && emailAddress.includes('@')) {
      setError(null);
      setSuccess(null);
      try {
        console.log('Sending OTP to:', emailAddress);
        await sendOtp(emailAddress);
        console.log('OTP sent successfully, showing verification screen');
        setShowOtpVerification(true);
        setSuccess('OTP sent successfully to your email!');
      } catch (error: any) {
        console.error('Error sending OTP:', error);
        setError(error.message || 'Failed to send OTP. Please try again.');
      }
    } else {
      setError('Please enter a valid email address');
    }
  };

  const handleOtpVerification = async () => {
    const otpValue = otp.join('');
    console.log('Verifying OTP:', otpValue, 'for email:', emailAddress);
    if (otpValue.length === 6) {
      setError(null);
      setSuccess(null);
      try {
        console.log('Calling verifyOtp API...');
        const loggedInUser = await verifyOtp(emailAddress, parseInt(otpValue));
        console.log('OTP verification successful');
        console.log('👤 User data from OTP verification:', loggedInUser);
        console.log('🎯 User role:', loggedInUser?.role);
        
        setShowOtpVerification(false);
        setSuccess('Login successful!');
        
        // Reset form
        setEmailAddress('');
        setOtp(['', '', '', '', '', '']);
        
        // Role-based routing after successful OTP verification
        console.log('🔄 Starting role-based redirect...');
        
        if (loggedInUser?.role === 'admin') {
          console.log('🔐 Admin user detected, redirecting to admin dashboard');
          setTimeout(() => {
            window.location.href = "/dashboardmaintab";
          }, 100);
        } else {
          const target = returnUrl && returnUrl.startsWith('/') ? returnUrl : '/';
          console.log('👤 Regular user detected, redirecting to:', target);
          setTimeout(() => {
            router.push(target);
          }, 100);
        }
      } catch (error: any) {
        console.error('OTP verification error:', error);
        setError(error.message || 'Invalid OTP. Please try again.');
      }
    } else {
      setError('Please enter complete OTP');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
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
    
    try {
      await signup(signupData);
      setSuccess('Account created successfully! Please login with your email.');
      setAuthMode('login');
      setEmailAddress(signupData.email);
      // Reset signup form
      setSignupData({
        firstName: '',
        lastName: '',
        gender: 'male',
        email: '',
        mobileNo: ''
      });
    } catch (error: any) {
      setError(error.message || 'Registration failed. Please try again.');
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


  // Show redirecting message if user is authenticated
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#61503c] mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Login Screen
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

export default LoginPage;
