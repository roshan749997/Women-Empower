import { WishListItem } from "../types/wishlist";
import { getToken, getUser } from "../lib/auth";

// API Response interfaces
interface WishlistApiResponse {
  success: boolean;
  message: string;
  data: WishlistApiItem[];
}

interface WishlistApiItem {
  id: string; // This is the wishlist item ID
  user_id: string;
  product: {
    id: string; // This is the product ID
    p_Name: string;
    thumbnail: string;
    category_id: string;
    price: string;
    discount: number;
    isTrending: boolean;
    is_in_wishlist: boolean;
  };
}

export async function getWishListItems(userId?: string): Promise<WishListItem[]> {
  try {
    const token = getToken();
    const user = getUser();
    
    // Use provided userId or get from stored user
    const targetUserId = userId || user?.id;
    
    if (!targetUserId) {
      console.error('No user ID available for wishlist fetch');
      return [];
    }
    
    if (!token) {
      console.error('No auth token available for wishlist fetch');
      return [];
    }

    const response = await fetch(`http://localhost:5000/v1/wishlist/${targetUserId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Treat unauthorized/forbidden as empty wishlist without logging an error
    if (response.status === 401 || response.status === 403) {
      return [];
    }

    if (!response.ok) {
      console.error('Failed to fetch wishlist:', response.status, response.statusText);
      return [];
    }

    const data: WishlistApiResponse = await response.json();
    
    if (!data.success) {
      console.error('API returned error:', data.message);
      return [];
    }

    // Transform API response to our WishListItem format
    const wishlistItems: WishListItem[] = data.data.map((item) => ({
      id: item.product.id, // Product ID
      wishlistItemId: item.id, // Wishlist item ID for deletion
      p_Name: item.product.p_Name,
      thumbnail: item.product.thumbnail,
      category_id: item.product.category_id,
      price: item.product.price,
      discount: item.product.discount,
      isTrending: item.product.isTrending,
      is_in_wishlist: item.product.is_in_wishlist,
    }));

    return wishlistItems;
  } catch (error) {
    // Network or parsing error; keep console noise low
    console.warn('Wishlist fetch error (network/parsing):', error);
    return [];
  }
}

export async function addToWishlist(productId: string, userId?: string): Promise<boolean> {
  try {
    const token = getToken();
    const user = getUser();
    
    // Use provided userId or get from stored user
    const targetUserId = userId || user?.id;
    
    if (!targetUserId) {
      console.error('No user ID available for adding to wishlist');
      return false;
    }
    
    if (!token) {
      console.error('No auth token available for adding to wishlist');
      return false;
    }

    const response = await fetch('http://localhost:5000/v1/wishlist', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: targetUserId,
        product_id: productId,
      }),
    });

    // Gracefully handle unauthorized/forbidden
    if (response.status === 401 || response.status === 403) {
      return false;
    }

    if (!response.ok) {
      console.error('Failed to add to wishlist:', response.status, response.statusText);
      return false;
    }

    const data = await response.json();
    return data.success || false;
  } catch (error) {
    console.warn('Wishlist add error (network/parsing):', error);
    return false;
  }
}

export async function removeFromWishlist(wishlistItemId: string): Promise<boolean> {
  try {
    const token = getToken();
    
    if (!token) {
      console.error('No auth token available for removing from wishlist');
      return false;
    }

    const response = await fetch(`http://localhost:5000/v1/wishlist/${wishlistItemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Gracefully handle unauthorized/forbidden
    if (response.status === 401 || response.status === 403) {
      return false;
    }

    if (!response.ok) {
      console.error('Failed to remove from wishlist:', response.status, response.statusText);
      return false;
    }

    const data = await response.json();
    return data.success || false;
  } catch (error) {
    console.warn('Wishlist remove error (network/parsing):', error);
    return false;
  }
}
