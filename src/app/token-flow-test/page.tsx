'use client';

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getCurrentToken, getCurrentUser, isAuthenticated } from '../lib/authenticatedApi';
import { getArtistReviewsApi, createArtistReviewApi } from '../lib/artistReviewApi';

export default function TokenFlowTestPage() {
  const { user, token, isAuthenticated: contextAuth } = useAuth();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testTokenFlow = async () => {
    setLoading(true);
    setTestResults([]);
    
    try {
      // Test 1: Check authentication status
      addResult('🔍 Testing authentication status...');
      const localAuth = isAuthenticated();
      const localUser = getCurrentUser();
      const localToken = getCurrentToken();
      
      addResult(`✅ Context authenticated: ${contextAuth}`);
      addResult(`✅ Local authenticated: ${localAuth}`);
      addResult(`✅ User exists: ${!!user || !!localUser}`);
      addResult(`✅ Token exists: ${!!token || !!localToken}`);
      
      if (!localUser || !localToken) {
        addResult('❌ No user or token found. Please login first.');
        return;
      }
      
      // Test 2: Test getArtistReviewsApi with real artist ID
      addResult('🔍 Testing getArtistReviewsApi with real artist ID...');
      try {
        // Use the artist ID from your example
        const testArtistId = '32f61c5f-7178-4e50-90fc-95e7ae04333b';
        const reviews = await getArtistReviewsApi(testArtistId, localToken);
        addResult(`✅ getArtistReviewsApi successful: ${reviews.length} reviews`);
        
        if (reviews.length > 0) {
          const firstReview = reviews[0];
          addResult(`📝 Sample review: Rating ${firstReview.rating}, Description: "${firstReview.rating_description}"`);
          addResult(`📅 Review date: ${firstReview.date}`);
        }
      } catch (error) {
        addResult(`❌ getArtistReviewsApi failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      
      // Test 3: Test createArtistReviewApi
      addResult('🔍 Testing createArtistReviewApi...');
      try {
        const reviewData = {
          artist_id: '32f61c5f-7178-4e50-90fc-95e7ae04333b', // Use real artist ID
          user_id: localUser.id,
          rating: 5,
          rating_description: 'Test review from token flow test - ' + new Date().toISOString()
        };
        
        await createArtistReviewApi(reviewData, localToken);
        addResult('✅ createArtistReviewApi successful');
      } catch (error) {
        addResult(`❌ createArtistReviewApi failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      
      addResult('🎉 Token flow test completed!');
      
    } catch (error) {
      addResult(`❌ Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Token Flow Test</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Authentication Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Context User:</strong> {user ? `${user.firstName} ${user.lastName}` : 'None'}</p>
              <p><strong>Context Token:</strong> {token ? `${token.substring(0, 20)}...` : 'None'}</p>
            </div>
            <div>
              <p><strong>Local User:</strong> {getCurrentUser() ? `${getCurrentUser()?.firstName} ${getCurrentUser()?.lastName}` : 'None'}</p>
              <p><strong>Local Token:</strong> {getCurrentToken() ? `${getCurrentToken()?.substring(0, 20)}...` : 'None'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          <div className="space-x-4">
            <button
              onClick={testTokenFlow}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {loading ? 'Testing...' : 'Test Token Flow'}
            </button>
            <button
              onClick={clearResults}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Clear Results
            </button>
          </div>
        </div>

        {testResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
              {testResults.map((result, index) => (
                <div key={index} className="mb-1">
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-blue-700">
            <li>Make sure you are logged in to the application</li>
            <li>Click "Test Token Flow" to run comprehensive token tests</li>
            <li>Check the results to see if all API calls work with the stored token</li>
            <li>If any test fails, check the browser console for detailed error messages</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
