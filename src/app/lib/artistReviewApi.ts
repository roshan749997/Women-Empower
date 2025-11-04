// Artist Reviews API functions
import { getAuthenticatedHeaders, getCurrentToken } from './authenticatedApi';

export const getArtistReviewsApi = async (artistId: string, token?: string) => {
  // Get token from localStorage if not provided
  const authToken = token || getCurrentToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // Add authorization header if token is available
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  const res = await fetch(`http://localhost:5000/v1/artist-review/${artistId}`, { 
    cache: 'no-store',
    headers
  });
  
  const contentType = res.headers.get('content-type') || '';
  let parsed: any = null;
  try {
    parsed = contentType.includes('application/json') ? await res.json() : { message: await res.text() };
  } catch {
    parsed = {};
  }
  
  if (!res.ok) {
    const msg = parsed?.message || parsed?.error || `Failed to fetch artist reviews (status ${res.status})`;
    const error = new Error(msg);
    // @ts-ignore
    (error as any).details = parsed;
    throw error;
  }
  
  // Debug: Log the API response
  console.log('📋 Artist Reviews API Response:', parsed);
  console.log('📊 Reviews data:', parsed.data);
  
  return parsed.data || [];
};

export const createArtistReviewApi = async (reviewData: {
  artist_id: string;
  user_id: string;
  rating: number;
  rating_description: string;
}, token?: string) => {
  // Get token from localStorage if not provided
  const authToken = token || getCurrentToken();
  
  if (!authToken) {
    throw new Error('Authorization token missing');
  }
  
  // Debug: Log the token being used
  console.log('🔑 Token being used for API call:', authToken);
  console.log('📝 Review data:', reviewData);
  
  const res = await fetch('http://localhost:5000/v1/artist-review', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify(reviewData),
  });
  
  const contentType = res.headers.get('content-type') || '';
  let parsed: any = null;
  try {
    parsed = contentType.includes('application/json') ? await res.json() : { message: await res.text() };
  } catch {
    parsed = {};
  }
  
  if (!res.ok) {
    const msg = parsed?.message || parsed?.error || `Failed to create artist review (status ${res.status})`;
    const error = new Error(msg);
    // @ts-ignore
    (error as any).details = parsed;
    throw error;
  }
  
  return parsed.data || parsed;
};
