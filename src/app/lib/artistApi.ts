import { getToken } from './auth';

// Artist Product API Response interfaces
interface ArtistProductApiResponse {
  success: boolean;
  message: string;
  data: ArtistProductApiItem[];
}

interface ArtistProductApiItem {
  id: string;
  p_Name: string;
  p_images: string[];
  thumbnail: string;
  category_id: string;
  artist_id: string;
  price: string;
  discount: number;
  sell_count: number;
  description: string;
  specification: string;
  isTrending: boolean;
}

// Our internal Artist Product interface
export interface ArtistProduct {
  id: string;
  p_Name: string;
  p_images: string[];
  thumbnail: string;
  category_id: string;
  artist_id: string;
  price: string;
  discount: number;
  sell_count: number;
  description: string;
  specification: string;
  isTrending: boolean;
  is_in_wishlist?: boolean;
}

export async function getArtistProducts(artistId: string): Promise<ArtistProduct[]> {
  try {
    const token = getToken();
    
    if (!token) {
      console.error('No auth token available for fetching artist products');
      return [];
    }

    const response = await fetch(`http://localhost:5000/v1/product/artist/${artistId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch artist products:', response.status, response.statusText);
      return [];
    }

    const data: ArtistProductApiResponse = await response.json();
    
    if (!data.success) {
      console.error('API returned error:', data.message);
      return [];
    }

    // Transform API response to our ArtistProduct format
    const artistProducts: ArtistProduct[] = data.data.map((item) => ({
      id: item.id,
      p_Name: item.p_Name,
      p_images: item.p_images,
      thumbnail: item.thumbnail,
      category_id: item.category_id,
      artist_id: item.artist_id,
      price: item.price,
      discount: item.discount,
      sell_count: item.sell_count,
      description: item.description,
      specification: item.specification,
      isTrending: item.isTrending,
      is_in_wishlist: false, // Will be updated by wishlist context
    }));

    return artistProducts;
  } catch (error) {
    console.error('Error fetching artist products:', error);
    return [];
  }
}
