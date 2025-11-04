// lib/api/bannerApi.ts
import { Banner, CreateBannerDTO, UpdateBannerDTO } from "../types/dashboard-banner-tab";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// ============================================
// SERVER-SIDE API CALLS (for SSR)
// ============================================

export async function fetchBannersServer(): Promise<Banner[]> {
  try {
    // Try the backend API first
    const res = await fetch('http://localhost:5000/v1/banner/', {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.warn('Backend banner API not available, returning empty array');
      return [];
    }

    const data = await res.json();
    return data.data || data.banners || [];
  } catch (error) {
    console.warn('Server Error fetching banners:', error);
    return [];
  }
}

// ============================================
// CLIENT-SIDE API CALLS
// ============================================

export async function fetchBannersClient(): Promise<Banner[]> {
  try {
    const res = await fetch('http://localhost:5000/v1/banner/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.warn('Backend banner API not available');
      return [];
    }

    const data = await res.json();
    return data.data || data.banners || [];
  } catch (error) {
    console.warn('Error fetching banners:', error);
    return [];
  }
}

export async function fetchBannersByType(type: string): Promise<Banner[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/banners?type=${type}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch banners by type');
    }

    const data = await res.json();
    return data.banners || [];
  } catch (error) {
    console.error('Error fetching banners by type:', error);
    throw error;
  }
}

export async function createBannerApi(payload: CreateBannerDTO): Promise<Banner> {
  try {
    const res = await fetch(`${API_BASE_URL}/banners`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to create banner');
    }

    const data = await res.json();
    return data.banner;
  } catch (error) {
    console.error('Error creating banner:', error);
    throw error;
  }
}

export async function updateBannerApi(id: string, payload: UpdateBannerDTO): Promise<Banner> {
  try {
    const res = await fetch(`${API_BASE_URL}/banners/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to update banner');
    }

    const data = await res.json();
    return data.banner;
  } catch (error) {
    console.error('Error updating banner:', error);
    throw error;
  }
}

export async function deleteBannerApi(id: string): Promise<void> {
  try {
    const res = await fetch(`${API_BASE_URL}/banners/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to delete banner');
    }
  } catch (error) {
    console.error('Error deleting banner:', error);
    throw error;
  }
}

export async function uploadImageApi(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to upload image');
    }

    const data = await res.json();
    return data.url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}