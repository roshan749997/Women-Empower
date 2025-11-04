'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { debugTokenStatus, getToken, getUser, isTokenValid } from '../lib/auth';

export default function TokenTestPage() {
  const { user, token, isAuthenticated, isLoading } = useAuth();
  const [localToken, setLocalToken] = useState<string | null>(null);
  const [localUser, setLocalUser] = useState<any>(null);

  useEffect(() => {
    // Get token and user directly from localStorage
    setLocalToken(getToken());
    setLocalUser(getUser());
  }, []);

  const handleDebugToken = () => {
    debugTokenStatus();
  };

  const handleCheckLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      const user = localStorage.getItem('auth_user');
      
      console.log('🔍 Direct localStorage check:');
      console.log('Token:', token);
      console.log('User:', user);
      
      setLocalToken(token);
      setLocalUser(user ? JSON.parse(user) : null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Token Debug Page</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Is Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
              <p><strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <p><strong>User Exists:</strong> {user ? 'Yes' : 'No'}</p>
              <p><strong>Token Exists:</strong> {token ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">User Information</h2>
          {user ? (
            <div className="space-y-2">
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
            </div>
          ) : (
            <p className="text-gray-500">No user data available</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Token Information</h2>
          {token ? (
            <div className="space-y-2">
              <p><strong>Token:</strong> {token.substring(0, 50)}...</p>
              <p><strong>Token Valid:</strong> {isTokenValid(token) ? 'Yes' : 'No'}</p>
              <p><strong>Token Length:</strong> {token.length} characters</p>
            </div>
          ) : (
            <p className="text-gray-500">No token available</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Local Storage Check</h2>
          <div className="space-y-2">
            <p><strong>Local Token:</strong> {localToken ? `${localToken.substring(0, 50)}...` : 'None'}</p>
            <p><strong>Local User:</strong> {localUser ? `${localUser.firstName} ${localUser.lastName}` : 'None'}</p>
          </div>
          <button
            onClick={handleCheckLocalStorage}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Refresh Local Storage Check
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Debug Actions</h2>
          <div className="space-x-4">
            <button
              onClick={handleDebugToken}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Debug Token (Console)
            </button>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  console.log('🔍 Manual localStorage check:');
                  console.log('auth_token:', localStorage.getItem('auth_token'));
                  console.log('auth_user:', localStorage.getItem('auth_user'));
                }
              }}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
            >
              Manual Console Check
            </button>
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-yellow-700">
            <li>Make sure you are logged in to the application</li>
            <li>Click "Debug Token (Console)" to see detailed token information in the browser console</li>
            <li>Open browser console (F12) to see the debug output</li>
            <li>Check if the token is valid and not expired</li>
            <li>If token is missing, try logging in again</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
