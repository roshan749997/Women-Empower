"use client";

import React from 'react';
import { Email, AccountCircle, Shield, ArrowBack, Phone } from '@mui/icons-material';

interface LoginSignupProps {
  authMode: 'login' | 'signup';
  setAuthMode: (mode: 'login' | 'signup') => void;
  emailAddress: string;
  setEmailAddress: (email: string) => void;
  showOtpVerification: boolean;
  setShowOtpVerification: (show: boolean) => void;
  otp: string[];
  setOtp: (otp: string[]) => void;
  signupData: {
    firstName: string;
    lastName: string;
    gender: 'male' | 'female';
    email: string;
    mobileNo: string;
  };
  setSignupData: (data: {
    firstName: string;
    lastName: string;
    gender: 'male' | 'female';
    email: string;
    mobileNo: string;
  } | ((prev: {
    firstName: string;
    lastName: string;
    gender: 'male' | 'female';
    email: string;
    mobileNo: string;
  }) => {
    firstName: string;
    lastName: string;
    gender: 'male' | 'female';
    email: string;
    mobileNo: string;
  })) => void;
  handleEmailLogin: () => void;
  handleOtpVerification: () => void;
  handleOtpChange: (index: number, value: string) => void;
  handleSignup: () => void;
  handleResendOtp?: () => void;
}

const Login: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
  </svg>
);

const LoginSignup: React.FC<LoginSignupProps> = ({
  authMode,
  setAuthMode,
  emailAddress,
  setEmailAddress,
  showOtpVerification,
  setShowOtpVerification,
  otp,
  setOtp,
  signupData,
  setSignupData,
  handleEmailLogin,
  handleOtpVerification,
  handleOtpChange,
  handleSignup,
  handleResendOtp
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {!showOtpVerification ? (
          <div className="bg-white rounded-2xl shadow-xl p-10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#61503c] rounded-full flex items-center justify-center mx-auto mb-4">
                {authMode === 'login' ? (
                  <Email className="w-8 h-8 text-white" />
                ) : (
                  <AccountCircle className="w-8 h-8 text-white" />
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {authMode === 'login' ? 'Welcome Back!' : 'Create Account'}
              </h1>
              <p className="text-gray-600">
                {authMode === 'login' 
                  ? 'Enter your email address to continue'
                  : 'Fill in your details to create an account'
                }
              </p>
            </div>

            {/* Auth Mode Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              <button
                onClick={() => setAuthMode('login')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all ${
                  authMode === 'login'
                    ? 'bg-[#61503c] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Login />
                <span>Login</span>
              </button>
              <button
                onClick={() => setAuthMode('signup')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all ${
                  authMode === 'signup'
                    ? 'bg-[#61503c] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <AccountCircle className="w-4 h-4" />
                <span>Sign Up</span>
              </button>
            </div>

            <div className="space-y-6">
              {authMode === 'login' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <Email className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={signupData.firstName || ''}
                        onChange={(e) => setSignupData(prev => ({ ...prev, firstName: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="First name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={signupData.lastName || ''}
                        onChange={(e) => setSignupData(prev => ({ ...prev, lastName: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Last name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value="male"
                          checked={signupData.gender === 'male'}
                          onChange={() => setSignupData(prev => ({ ...prev, gender: 'male' }))}
                          className="mr-2"
                        />
                        <span>Male</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          checked={signupData.gender === 'female'}
                          onChange={() => setSignupData(prev => ({ ...prev, gender: 'female' }))}
                          className="mr-2"
                        />
                        <span>Female</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <Email className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        value={signupData.email || ''}
                        onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <Phone className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        value={signupData.mobileNo || ''}
                        onChange={(e) => setSignupData(prev => ({ ...prev, mobileNo: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter 10-digit mobile number"
                        maxLength={10}
                      />
                    </div>
                  </div>
                </>
              )}

              <button
                onClick={authMode === 'login' ? handleEmailLogin : handleSignup}
                disabled={
                  authMode === 'login' 
                    ? !emailAddress || !emailAddress.includes('@')
                    : !signupData.firstName || !signupData.lastName || !signupData.email || !signupData.mobileNo
                }
                className="w-full bg-[#61503c] text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {authMode === 'login' ? 'Send OTP' : 'Create Account'}
              </button>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-10">
            <button
              onClick={() => setShowOtpVerification(false)}
              className="mb-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowBack className="w-5 h-5 text-gray-600" />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#61503c] rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify OTP</h1>
              <p className="text-gray-600">
                We've sent a 6-digit code to {emailAddress}
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    maxLength={1}
                  />
                ))}
              </div>

              <button
                onClick={handleOtpVerification}
                disabled={otp.join('').length !== 6}
                className="w-full bg-[#61503c] text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Verify & Continue
              </button>

              <div className="text-center">
                <button 
                  onClick={handleResendOtp}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Resend OTP
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginSignup;
