
export const fetchArtists = async () => {
  const res = await fetch('http://localhost:5000/api/artist', { cache: 'no-store' });
  const data = await res.json();
  return data;
}

// Category APIs (v1)
export const getCategoriesApi = async () => {
  const res = await fetch('http://localhost:5000/v1/category/', { cache: 'no-store' });
  const body = await res.json();
  const list = body.data || [];
  try {
    const { buildR2PublicUrl } = await import('./utils/dashboardartist-utils');
    return Array.isArray(list)
      ? list.map((c: any) => ({ ...c, image: buildR2PublicUrl(c?.image || '') }))
      : list;
  } catch {
    return list;
  }
};

// Get category details by ID
export const getCategoryDetailsApi = async (categoryId: string) => {
  const res = await fetch(`http://localhost:5000/v1/category/${categoryId}`, { cache: 'no-store' });
  const contentType = res.headers.get('content-type') || '';
  let parsed: any = null;
  try {
    parsed = contentType.includes('application/json') ? await res.json() : { message: await res.text() };
  } catch {
    parsed = {};
  }
  if (!res.ok) {
    const msg = parsed?.message || parsed?.error || `Failed to fetch category details (status ${res.status})`;
    const error = new Error(msg);
    // @ts-ignore
    (error as any).details = parsed;
    throw error;
  }
  return parsed?.data;
};

export const createCategory = async (payload: { name: string; image?: string }) => {
  const { getAuthHeaders } = await import('./authApi');
  let imageKey = payload.image || '';
  // If image is a data URL, upload to R2 first and send the key
  if (imageKey && /^data:\w+\/[\w.+-]+;base64,/.test(imageKey)) {
    const { uploadToR2 } = await import('./utils/r2Client');
    const uploaded = await uploadToR2(imageKey);
    imageKey = uploaded.key;
  }

  const res = await fetch('http://localhost:5000/v1/category/', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ name: payload.name, image: imageKey }),
  });
  const body = await res.json();
  return body.data;
};

export const updateCategory = async (id: string, payload: { name: string; image: string }) => {
  const { getAuthHeaders } = await import('./authApi');
  let imageKey = payload.image || '';
  if (imageKey && /^data:\w+\/[\w.+-]+;base64,/.test(imageKey)) {
    const { uploadToR2 } = await import('./utils/r2Client');
    const uploaded = await uploadToR2(imageKey);
    imageKey = uploaded.key;
  }
  const res = await fetch(`http://localhost:5000/v1/category/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ name: payload.name, image: imageKey }),
  });
  const body = await res.json();
  return body.data;
};

export const deleteCategory = async (id: string) => {
  const { getAuthHeaders } = await import('./authApi');
  const res = await fetch(`http://localhost:5000/v1/category/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error('Failed to delete category');
  }
  // Some APIs return 204 No Content; return true for success
  return true;
};

export const getArtistsApi = async (page: number = 1) => {
  const url = `http://localhost:5000/v1/artist/?page=${encodeURIComponent(page)}`;
  const res = await fetch(url, { cache: 'no-store' });
  const contentType = res.headers.get('content-type') || '';
  let parsed: any = null;
  try {
    parsed = contentType.includes('application/json') ? await res.json() : { message: await res.text() };
  } catch {
    parsed = {};
  }
  if (!res.ok) {
    const msg = parsed?.message || parsed?.error || `Failed to fetch artists (status ${res.status})`;
    const error = new Error(msg);
    // @ts-ignore
    (error as any).details = parsed;
    throw error;
  }
  // Return the artists array from the nested data structure
  return parsed?.data?.data || [];
};

// Search artists by name
export const searchArtistsApi = async (query: string) => {
  const url = `http://localhost:5000/v1/artist/${encodeURIComponent(query)}`;
  const res = await fetch(url, { cache: 'no-store' });
  const contentType = res.headers.get('content-type') || '';
  let parsed: any = null;
  try {
    parsed = contentType.includes('application/json') ? await res.json() : { message: await res.text() };
  } catch {
    parsed = {};
  }
  if (!res.ok) {
    const msg = parsed?.message || parsed?.error || `Failed to search artists (status ${res.status})`;
    const error = new Error(msg);
    // @ts-ignore
    (error as any).details = parsed;
    throw error;
  }
  return parsed?.data || [];
};

// Filter artists by categories and experience
export const filterArtistsApi = async (filters: {
  categories?: string[];
  experience?: {
    minExp: number;
    maxExp: number;
  };
}) => {
  const url = 'http://localhost:5000/v1/artist/filter';
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filters),
    cache: 'no-store'
  });
  const contentType = res.headers.get('content-type') || '';
  let parsed: any = null;
  try {
    parsed = contentType.includes('application/json') ? await res.json() : { message: await res.text() };
  } catch {
    parsed = {};
  }
  if (!res.ok) {
    const msg = parsed?.message || parsed?.error || `Failed to filter artists (status ${res.status})`;
    const error = new Error(msg);
    // @ts-ignore
    (error as any).details = parsed;
    throw error;
  }
  return parsed?.data || [];
};

// Get artist details by ID
export const getArtistDetailsApi = async (id: string) => {
  const url = `http://localhost:5000/v1/artist/details/${encodeURIComponent(id)}`;
  const res = await fetch(url, { cache: 'no-store' });
  const contentType = res.headers.get('content-type') || '';
  let parsed: any = null;
  try {
    parsed = contentType.includes('application/json') ? await res.json() : { message: await res.text() };
  } catch {
    parsed = {};
  }
  if (!res.ok) {
    const msg = parsed?.message || parsed?.error || `Failed to fetch artist details (status ${res.status})`;
    const error = new Error(msg);
    // @ts-ignore
    (error as any).details = parsed;
    throw error;
  }
  return parsed?.data;
};

// Paginated Artists API
export const getArtistsPaginated = async (
  page: number = 1
): Promise<{ totalArtists: number; totalPages: number; currentPage: number; data: any[] }> => {
  const url = `http://localhost:5000/v1/artist/?page=${encodeURIComponent(page)}`;
  const res = await fetch(url, { cache: 'no-store' });
  const contentType = res.headers.get('content-type') || '';
  let parsed: any = null;
  try {
    parsed = contentType.includes('application/json') ? await res.json() : { message: await res.text() };
  } catch {
    parsed = {};
  }
  if (!res.ok) {
    const msg = parsed?.message || parsed?.error || `Failed to fetch artists (status ${res.status})`;
    const error = new Error(msg);
    // @ts-ignore
    (error as any).details = parsed;
    throw error;
  }
  const data = parsed?.data || {};
  return {
    totalArtists: Number(data.totalArtists) || (Array.isArray(data.data) ? data.data.length : 0),
    totalPages: Number(data.totalPages) || 1,
    currentPage: Number(data.currentPage) || page,
    data: Array.isArray(data.data) ? data.data : Array.isArray(parsed?.data) ? parsed.data : [],
  };
};

export const getCoursesApi = async () => {
  const res = await fetch('http://localhost:5000/v1/course/', { cache: 'no-store' });
  const contentType = res.headers.get('content-type') || '';
  let parsed: any = null;
  try {
    parsed = contentType.includes('application/json') ? await res.json() : { message: await res.text() };
  } catch {
    parsed = {};
  }
  if (!res.ok) {
    const msg = parsed?.message || parsed?.error || `Failed to fetch courses (status ${res.status})`;
    const error = new Error(msg);
    // @ts-ignore
    (error as any).details = parsed;
    throw error;
  }
  const list = parsed.data || [];
  try {
    const { buildR2PublicUrl } = await import('./utils/dashboardartist-utils');
    return Array.isArray(list)
      ? list.map((c: any) => ({
          ...c,
          thumbnail: buildR2PublicUrl(c?.thumbnail || ''),
        }))
      : list;
  } catch {
    return list;
  }
};

// Search courses by title, coordinator, or description
export const searchCoursesApi = async (query: string) => {
  const res = await fetch(`http://localhost:5000/v1/course/search?q=${encodeURIComponent(query)}`, { 
    cache: 'no-store' 
  });
  const contentType = res.headers.get('content-type') || '';
  let parsed: any = null;
  try {
    parsed = contentType.includes('application/json') ? await res.json() : { message: await res.text() };
  } catch {
    parsed = {};
  }
  if (!res.ok) {
    const msg = parsed?.message || parsed?.error || `Failed to search courses (status ${res.status})`;
    const error = new Error(msg);
    // @ts-ignore
    (error as any).details = parsed;
    throw error;
  }
  return parsed.data || [];
};

// Filter courses by categories, levels, and price range
export const filterCoursesApi = async (filters: {
  categories?: string[];
  levels?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
}) => {
  const res = await fetch('http://localhost:5000/v1/course/filter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filters),
    cache: 'no-store'
  });
  const contentType = res.headers.get('content-type') || '';
  let parsed: any = null;
  try {
    parsed = contentType.includes('application/json') ? await res.json() : { message: await res.text() };
  } catch {
    parsed = {};
  }
  if (!res.ok) {
    const msg = parsed?.message || parsed?.error || `Failed to filter courses (status ${res.status})`;
    const error = new Error(msg);
    // @ts-ignore
    (error as any).details = parsed;
    throw error;
  }
  return parsed.data || [];
};

export const deleteCourse = async (id: string) => {
  const { getAuthHeaders } = await import('./authApi');
  const res = await fetch(`http://localhost:5000/v1/course/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    let message = `Failed to delete course (status ${res.status})`;
    try {
      const data = await res.json();
      message = data?.message || data?.error || message;
    } catch {}
    throw new Error(message);
  }
  return true;
};

export const createCourse = async (payload: {
  thumbnail: string;
  course_coordinator: string;
  category_id: string;
  title: string;
  description: string;
  lessons: number;
  level: string;
  price: number | string;
  discount: number;
}) => {
  const { getAuthHeaders } = await import('./authApi');
  // If thumbnail is a data URL, upload to R2 and keep only the key
  let thumbKey = payload.thumbnail || '';
  const isDataUrl = (v?: string) => !!v && /^data:\\w+\/[\\w.+-]+;base64,/.test(v);
  // Runtime-safe version (no extra escaping)
  const _isDataUrl = (v?: string) => !!v && /^data:\w+\/[\w.+-]+;base64,/.test(v);
  if (thumbKey && (isDataUrl(thumbKey) || _isDataUrl(thumbKey))) {
    const { uploadToR2 } = await import('./utils/r2Client');
    const uploaded = await uploadToR2(thumbKey);
    thumbKey = uploaded.key;
  }
  const res = await fetch('http://localhost:5000/v1/course/', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ ...payload, thumbnail: thumbKey }),
  });
  const contentType = res.headers.get('content-type') || '';
  let parsed: any = null;
  try {
    parsed = contentType.includes('application/json') ? await res.json() : { message: await res.text() };
  } catch {
    parsed = {};
  }
  if (!res.ok) {
    const msg = parsed?.message || parsed?.error || `Failed to create course (status ${res.status})`;
    const error = new Error(msg);
    // @ts-ignore
    (error as any).details = parsed;
    throw error;
  }
  return parsed.data;
};

export const updateCourse = async (
  id: string,
  payload: {
    thumbnail: string;
    course_coordinator: string;
    category_id: string;
    title: string;
    description: string;
    lessons: number;
    level: string;
    price: number | string;
    discount: number;
  }
) => {
  const { getAuthHeaders } = await import('./authApi');
  let thumbKey = payload.thumbnail || '';
  const isDataUrl2 = (v?: string) => !!v && /^data:\\w+\/[\\w.+-]+;base64,/.test(v);
  const _isDataUrl2 = (v?: string) => !!v && /^data:\w+\/[\w.+-]+;base64,/.test(v);
  if (thumbKey && (isDataUrl2(thumbKey) || _isDataUrl2(thumbKey))) {
    const { uploadToR2 } = await import('./utils/r2Client');
    const uploaded = await uploadToR2(thumbKey);
    thumbKey = uploaded.key;
  }
  const res = await fetch(`http://localhost:5000/v1/course/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ ...payload, thumbnail: thumbKey }),
  });
  const contentType = res.headers.get('content-type') || '';
  let parsed: any = null;
  try {
    parsed = contentType.includes('application/json') ? await res.json() : { message: await res.text() };
  } catch {
    parsed = {};
  }
  if (!res.ok) {
    const msg = parsed?.message || parsed?.error || `Failed to update course (status ${res.status})`;
    const error = new Error(msg);
    // @ts-ignore
    (error as any).details = parsed;
    throw error;
  }
  return parsed.data;
};

// Helper: simple data URL detector
const isDataUrl = (val?: string) => !!val && /^data:\w+\/[\w.+-]+;base64,/.test(val);

// Create Artist with optional R2 image upload. If imageData is a base64 data URL,
// we upload it to R2 first and send only the R2 key to the API.
export const createArtist = async (
  payload: {
    artist_Name: string;
    category_id: string;
    introduction: string;
    experience: number;
    imageData?: string; // base64 data URL from file input
  }
) => {
  const { getAuthHeaders } = await import('./authApi');
  let r2Key: string | undefined;
  if (isDataUrl(payload.imageData)) {
    const { uploadToR2 } = await import('./utils/r2Client');
    const uploaded = await uploadToR2(payload.imageData as string);
    r2Key = uploaded.key; // store only the key in DB
  }

  const body: any = {
    artist_Name: payload.artist_Name,
    category_id: payload.category_id,
    introduction: payload.introduction,
    experience: payload.experience,
  };
  if (r2Key) body.artist_profile_pic = r2Key;

  const res = await fetch('http://localhost:5000/v1/artist/', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
  const contentType = res.headers.get('content-type') || '';
  let parsed: any = null;
  try {
    parsed = contentType.includes('application/json') ? await res.json() : { message: await res.text() };
  } catch {
    parsed = {};
  }
  if (!res.ok) {
    const msg = parsed?.message || parsed?.error || `Failed to create artist (status ${res.status})`;
    const error = new Error(msg);
    // @ts-ignore attach details for logging
    (error as any).details = parsed;
    throw error;
  }
  return parsed.data;
};

// Update Artist with optional new image upload to R2.
export const updateArtist = async (
  id: string,
  payload: {
    artist_Name: string;
    category_id: string;
    introduction: string;
    experience: number;
    imageData?: string; // optional base64 data URL if user selected a new image
  }
) => {
  const { getAuthHeaders } = await import('./authApi');
  let r2Key: string | undefined;
  if (isDataUrl(payload.imageData)) {
    const { uploadToR2 } = await import('./utils/r2Client');
    const uploaded = await uploadToR2(payload.imageData as string);
    r2Key = uploaded.key;
  }

  const body: any = {
    artist_Name: payload.artist_Name,
    category_id: payload.category_id,
    introduction: payload.introduction,
    experience: payload.experience,
  };
  if (r2Key) body.artist_profile_pic = r2Key; // only include if changed

  const res = await fetch(`http://localhost:5000/v1/artist/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
  const contentType = res.headers.get('content-type') || '';
  let parsed: any = null;
  try {
    parsed = contentType.includes('application/json') ? await res.json() : { message: await res.text() };
  } catch {
    parsed = {};
  }
  if (!res.ok) {
    const msg = parsed?.message || parsed?.error || `Failed to update artist (status ${res.status})`;
    const error = new Error(msg);
    // @ts-ignore
    (error as any).details = parsed;
    throw error;
  }
  return parsed.data;
};

export const deleteArtist = async (id: string) => {
  const { getAuthHeaders } = await import('./authApi');
  const res = await fetch(`http://localhost:5000/v1/artist/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error('Failed to delete artist');
  }
  return true;
};

export const fetchFeaturedEvents = async () => {
  const res = await fetch('http://localhost:5000/api/featured-events', { cache: 'force-cache' });
  const data = await res.json();
  return data;
}

export const fetchEvents = async () => {
  console.log("Fetching events...");
  const res = await fetch('http://localhost:5000/api/events', { cache: 'force-cache' });
  const data = await res.json();
  return data;
}

// Events API (v1)
import { buildR2PublicUrl } from './utils/dashboardartist-utils';

export const getEventsV1 = async () => {
  const res = await fetch('http://localhost:5000/v1/event/', { cache: 'no-store' });
  const contentType = res.headers.get('content-type') || '';
  let parsed: any = null;
  try {
    parsed = contentType.includes('application/json') ? await res.json() : { message: await res.text() };
  } catch {
    parsed = {};
  }
  if (!res.ok) {
    const msg = parsed?.message || parsed?.error || `Failed to fetch events (status ${res.status})`;
    const error = new Error(msg);
    // @ts-ignore
    (error as any).details = parsed;
    throw error;
  }
  const list = Array.isArray(parsed?.data) ? parsed.data : [];
  // Normalize to dashboard Event type
  return list.map((it: any) => ({
    id: it.id,
    thumbnail: buildR2PublicUrl(it.e_image || ''),
    category: it.category_id || '',
    title: it.title || '',
    description: it.description || '',
    dateTime: it.date_time || '',
    status: (it.status || 'upcoming'),
    keywords: typeof it.keywords === 'string' ? it.keywords.split(',').map((k: string) => k.trim()).filter(Boolean) : Array.isArray(it.keywords) ? it.keywords : [],
    banner: buildR2PublicUrl(it.banner || undefined),
  }));
};

// Get all events for events page
export const getEventsApi = async () => {
  const res = await fetch('http://localhost:5000/v1/event/', { cache: 'no-store' });
  const contentType = res.headers.get('content-type') || '';
  let parsed: any = null;
  try {
    parsed = contentType.includes('application/json') ? await res.json() : { message: await res.text() };
  } catch {
    parsed = {};
  }
  if (!res.ok) {
    const msg = parsed?.message || parsed?.error || `Failed to fetch events (status ${res.status})`;
    const error = new Error(msg);
    // @ts-ignore
    (error as any).details = parsed;
    throw error;
  }
  return parsed.data || [];
};

// Search events by title, description, or keywords
export const searchEventsApi = async (query: string) => {
  const res = await fetch(`http://localhost:5000/v1/event/search?q=${encodeURIComponent(query)}`, { 
    cache: 'no-store' 
  });
  const contentType = res.headers.get('content-type') || '';
  let parsed: any = null;
  try {
    parsed = contentType.includes('application/json') ? await res.json() : { message: await res.text() };
  } catch {
    parsed = {};
  }
  if (!res.ok) {
    const msg = parsed?.message || parsed?.error || `Failed to search events (status ${res.status})`;
    const error = new Error(msg);
    // @ts-ignore
    (error as any).details = parsed;
    throw error;
  }
  return parsed.data || [];
};

// Filter events by status and category
export const filterEventsApi = async (filters: {
  status?: string;
  category_id?: string;
}) => {
  const res = await fetch('http://localhost:5000/v1/event/filter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filters),
    cache: 'no-store'
  });
  const contentType = res.headers.get('content-type') || '';
  let parsed: any = null;
  try {
    parsed = contentType.includes('application/json') ? await res.json() : { message: await res.text() };
  } catch {
    parsed = {};
  }
  if (!res.ok) {
    const msg = parsed?.message || parsed?.error || `Failed to filter events (status ${res.status})`;
    const error = new Error(msg);
    // @ts-ignore
    (error as any).details = parsed;
    throw error;
  }
  return parsed.data || [];
};

// Get latest events for dashboard (limited to 4)
export const getLatestEvents = async () => {
  try {
    const res = await fetch('http://localhost:5000/v1/event/', { cache: 'no-store' });
    const contentType = res.headers.get('content-type') || '';
    let parsed: any = null;
    try {
      parsed = contentType.includes('application/json') ? await res.json() : { message: await res.text() };
    } catch {
      parsed = {};
    }
    if (!res.ok) {
      console.warn('Failed to fetch events for dashboard:', parsed?.message || 'Unknown error');
      return [];
    }
    
    const events = Array.isArray(parsed?.data) ? parsed.data : [];
    
    // Sort by date_time (newest first) and take latest 4
    const sortedEvents = events
      .sort((a: any, b: any) => new Date(b.date_time).getTime() - new Date(a.date_time).getTime())
      .slice(0, 4);
    
    // Format for dashboard display
    return sortedEvents.map((event: any) => ({
      name: event.title || 'Untitled Event',
      date: new Date(event.date_time).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: new Date(event.date_time).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
    }));
  } catch (error) {
    console.warn('Error fetching latest events:', error);
    return [];
  }
};

export const createEventV1 = async (
  payload: {
    e_image: string;
    category_id: string;
    title: string;
    description: string;
    date_time: string;
    status: string;
    keywords: string;
    banner?: string;
  }
) => {
  const { getAuthHeaders } = await import('./authApi');
  // Upload data-URL images to R2 and send keys
  let imgKey = payload.e_image || '';
  let bannerKey = payload.banner || '';
  const isDataUrl = (v?: string) => !!v && /^data:\\w+\/[\\w.+-]+;base64,/.test(v);
  const _isDataUrl = (v?: string) => !!v && /^data:\w+\/[\w.+-]+;base64,/.test(v);
  if (imgKey && (isDataUrl(imgKey) || _isDataUrl(imgKey))) {
    const { uploadToR2 } = await import('./utils/r2Client');
    const uploaded = await uploadToR2(imgKey);
    imgKey = uploaded.key;
  }
  if (bannerKey && (isDataUrl(bannerKey) || _isDataUrl(bannerKey))) {
    const { uploadToR2 } = await import('./utils/r2Client');
    const uploadedB = await uploadToR2(bannerKey);
    bannerKey = uploadedB.key;
  }
  const res = await fetch('http://localhost:5000/v1/event/', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      ...payload,
      e_image: imgKey,
      ...(bannerKey ? { banner: bannerKey } : {}),
    }),
  });
  const contentType = res.headers.get('content-type') || '';
  let parsed: any = null;
  try {
    parsed = contentType.includes('application/json') ? await res.json() : { message: await res.text() };
  } catch {
    parsed = {};
  }
  if (!res.ok) {
    const msg = parsed?.message || parsed?.error || `Failed to create event (status ${res.status})`;
    const error = new Error(msg);
    // @ts-ignore
    (error as any).details = parsed;
    throw error;
  }
  return parsed?.data ?? parsed;
};

export const updateEventV1 = async (
  id: string,
  payload: {
    e_image: string;
    category_id: string;
    title: string;
    description: string;
    date_time: string;
    status: string;
    keywords: string;
    banner?: string;
  }
) => {
  const { getAuthHeaders } = await import('./authApi');
  let imgKey = payload.e_image || '';
  let bannerKey = payload.banner || '';
  const isDataUrl2 = (v?: string) => !!v && /^data:\\w+\/[\\w.+-]+;base64,/.test(v);
  const _isDataUrl2 = (v?: string) => !!v && /^data:\w+\/[\w.+-]+;base64,/.test(v);
  if (imgKey && (isDataUrl2(imgKey) || _isDataUrl2(imgKey))) {
    const { uploadToR2 } = await import('./utils/r2Client');
    const uploaded = await uploadToR2(imgKey);
    imgKey = uploaded.key;
  }
  if (bannerKey && (isDataUrl2(bannerKey) || _isDataUrl2(bannerKey))) {
    const { uploadToR2 } = await import('./utils/r2Client');
    const uploadedB = await uploadToR2(bannerKey);
    bannerKey = uploadedB.key;
  }
  const res = await fetch(`http://localhost:5000/v1/event/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      ...payload,
      e_image: imgKey,
      ...(bannerKey ? { banner: bannerKey } : {}),
    }),
  });
  const contentType = res.headers.get('content-type') || '';
  let parsed: any = null;
  try {
    parsed = contentType.includes('application/json') ? await res.json() : { message: await res.text() };
  } catch {
    parsed = {};
  }
  if (!res.ok) {
    const msg = parsed?.message || parsed?.error || `Failed to update event (status ${res.status})`;
    console.error('Event update failed:', {
      status: res.status,
      statusText: res.statusText,
      response: parsed,
      payload
    });
    const error = new Error(msg);
    // @ts-ignore
    (error as any).details = parsed;
    throw error;
  }
  return parsed?.data ?? parsed;
};

export const deleteEventV1 = async (id: string) => {
  const { getAuthHeaders } = await import('./authApi');
  const res = await fetch(`http://localhost:5000/v1/event/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    let parsed: any = {};
    try {
      const contentType = res.headers.get('content-type') || '';
      parsed = contentType.includes('application/json') ? await res.json() : { message: await res.text() };
    } catch {}
    const msg = parsed?.message || parsed?.error || `Failed to delete event (status ${res.status})`;
    throw new Error(msg);
  }
  return true;
};

export const fetchCartItems = async () => {
  
  try {
    const response = await fetch('http://localhost:5000/api/cart');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    } 
    const data = await response.json();
    return data; 
  }
  catch (error) {
    console.error('Error fetching cart items:', error);
    return []; 
  }
};

export const fetchWishListItems = async () => {
  
  try {
    const response = await fetch('http://localhost:5000/api/wishlist');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    } 
    const data = await response.json();
    return data; 
  }
  catch (error) {
    console.error('Error fetching cart items:', error);
    return []; 
  }
};

// Dashboard counts API
export const getDashboardCounts = async (): Promise<{
  productCount: number;
  artistCount: number;
  courseCount: number;
  eventCount: number;
}> => {
  const { getAuthHeaders } = await import('./authApi');
  const res = await fetch('http://localhost:5000/v1/dashboard/', { 
    cache: 'no-store',
    headers: getAuthHeaders(),
  });
  const contentType = res.headers.get('content-type') || '';
  let parsed: any = null;
  try {
    parsed = contentType.includes('application/json') ? await res.json() : { message: await res.text() };
  } catch {
    parsed = {};
  }
  if (!res.ok) {
    const msg = parsed?.message || parsed?.error || `Failed to fetch dashboard counts (status ${res.status})`;
    const error = new Error(msg);
    // @ts-ignore
    (error as any).details = parsed;
    throw error;
  }
  const data = parsed?.data || {};
  return {
    productCount: Number(data.productCount) || 0,
    artistCount: Number(data.artistCount) || 0,
    courseCount: Number(data.courseCount) || 0,
    eventCount: Number(data.eventCount) || 0,
  };
};

export const clearWishlist = async () => {
  
  try {
    const response = await fetch('http://localhost:5000/api/wishlist');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    } 
    const data = await response.json();
    return data; 
  }
  catch (error) {
    console.error('Error fetching cart items:', error);
    return []; 
  }
};

// Authentication API functions
export const signupUser = async (userData: {
  firstName: string;
  lastName: string;
  gender: 'male' | 'female';
  email: string;
  mobileNo: string;
}) => {
  const res = await fetch('http://localhost:5000/v1/user/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  
  const contentType = res.headers.get('content-type') || '';
  let parsed: any = null;
  try {
    parsed = contentType.includes('application/json') ? await res.json() : { message: await res.text() };
  } catch {
    parsed = {};
  }
  
  if (!res.ok) {
    const msg = parsed?.message || parsed?.error || `Failed to create user (status ${res.status})`;
    const error = new Error(msg);
    // @ts-ignore
    (error as any).details = parsed;
    throw error;
  }
  
  return parsed;
};

export const sendOTP = async (email: string) => {
  const res = await fetch('http://localhost:5000/v1/login/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  
  const contentType = res.headers.get('content-type') || '';
  let parsed: any = null;
  try {
    parsed = contentType.includes('application/json') ? await res.json() : { message: await res.text() };
  } catch {
    parsed = {};
  }
  
  if (!res.ok) {
    const msg = parsed?.message || parsed?.error || `Failed to send OTP (status ${res.status})`;
    const error = new Error(msg);
    // @ts-ignore
    (error as any).details = parsed;
    throw error;
  }
  
  return parsed;
};

export const verifyOTP = async (email: string, otp: number) => {
  const res = await fetch('http://localhost:5000/v1/login/otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  });
  
  const contentType = res.headers.get('content-type') || '';
  let parsed: any = null;
  try {
    parsed = contentType.includes('application/json') ? await res.json() : { message: await res.text() };
  } catch {
    parsed = {};
  }
  
  if (!res.ok) {
    const msg = parsed?.message || parsed?.error || `Failed to verify OTP (status ${res.status})`;
    const error = new Error(msg);
    // @ts-ignore
    (error as any).details = parsed;
    throw error;
  }
  
  return parsed;
};

// Best Seller Products API
export const getBestSellerProducts = async () => {
  const res = await fetch('http://localhost:5000/v1/product/best-seller', { 
    cache: 'no-store' 
  });
  
  const contentType = res.headers.get('content-type') || '';
  let parsed: any = null;
  try {
    parsed = contentType.includes('application/json') ? await res.json() : { message: await res.text() };
  } catch {
    parsed = {};
  }
  
  if (!res.ok) {
    const msg = parsed?.message || parsed?.error || `Failed to fetch best seller products (status ${res.status})`;
    const error = new Error(msg);
    // @ts-ignore
    (error as any).details = parsed;
    throw error;
  }
  
  return parsed.data || [];
};

// Trending Products API
export const getTrendingProducts = async () => {
  const res = await fetch('http://localhost:5000/v1/product/trending', { 
    cache: 'no-store' 
  });
  
  const contentType = res.headers.get('content-type') || '';
  let parsed: any = null;
  try {
    parsed = contentType.includes('application/json') ? await res.json() : { message: await res.text() };
  } catch {
    parsed = {};
  }
  
  if (!res.ok) {
    const msg = parsed?.message || parsed?.error || `Failed to fetch trending products (status ${res.status})`;
    const error = new Error(msg);
    // @ts-ignore
    (error as any).details = parsed;
    throw error;
  }
  
  return parsed.data || [];
};

// Products API - Get all products with pagination
export const getProductsApi = async (page: number = 1) => {
  const url = `http://localhost:5000/v1/product/?page=${encodeURIComponent(page)}`;
  const res = await fetch(url, { cache: 'no-store' });
  const contentType = res.headers.get('content-type') || '';
  let parsed: any = null;
  try {
    parsed = contentType.includes('application/json') ? await res.json() : { message: await res.text() };
  } catch {
    parsed = {};
  }
  if (!res.ok) {
    const msg = parsed?.message || parsed?.error || `Failed to fetch products (status ${res.status})`;
    const error = new Error(msg);
    // @ts-ignore
    (error as any).details = parsed;
    throw error;
  }
  // Return the products array from the nested data structure
  return parsed?.data?.data || [];
};

// Search products by name
export const searchProductsApi = async (query: string) => {
  const url = `http://localhost:5000/v1/product/search/${encodeURIComponent(query)}`;
  const res = await fetch(url, { cache: 'no-store' });
  const contentType = res.headers.get('content-type') || '';
  let parsed: any = null;
  try {
    parsed = contentType.includes('application/json') ? await res.json() : { message: await res.text() };
  } catch {
    parsed = {};
  }
  if (!res.ok) {
    const msg = parsed?.message || parsed?.error || `Failed to search products (status ${res.status})`;
    const error = new Error(msg);
    // @ts-ignore
    (error as any).details = parsed;
    throw error;
  }
  return parsed?.data || [];
};

// Filter products by categories and price range
export const filterProductsApi = async (filters: {
  categories?: string[];
  price?: {
    minPrice: number;
    maxPrice: number;
  };
}) => {
  const res = await fetch('http://localhost:5000/v1/product/filter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filters),
    cache: 'no-store'
  });
  const contentType = res.headers.get('content-type') || '';
  let parsed: any = null;
  try {
    parsed = contentType.includes('application/json') ? await res.json() : { message: await res.text() };
  } catch {
    parsed = {};
  }
  if (!res.ok) {
    const msg = parsed?.message || parsed?.error || `Failed to filter products (status ${res.status})`;
    const error = new Error(msg);
    // @ts-ignore
    (error as any).details = parsed;
    throw error;
  }
  return parsed?.data || [];
};

// Contact Form API
export async function postcontactForm(formData: {
  first_name: string;
  last_name: string;
  mobileNo: string;
  mail: string;
  msg: string;
}) {
  try {
    const { getAuthHeaders } = await import('./authApi');
    
    const response = await fetch("http://localhost:5000/v1/contact-details/", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(formData),
    });

    // Check if response is not OK
    if (!response.ok) {
      const contentType = response.headers.get('content-type') || '';
      let errorData: any = null;
      try {
        errorData = contentType.includes('application/json') 
          ? await response.json() 
          : { message: await response.text() };
      } catch {
        errorData = { message: `HTTP error! status: ${response.status}` };
      }
      
      const errorMessage = errorData?.message || errorData?.error || `Failed to submit contact form (status ${response.status})`;
      throw new Error(errorMessage);
    }

    // Parse and return JSON response
    const data = await response.json();
    console.log("✅ Contact form submitted successfully:", data);
    return data;
  } catch (error: any) {
    console.error("❌ Error posting contact form:", error.message);
    throw error;
  }
}
