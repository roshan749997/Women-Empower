// Cart API functions
import { getAuthenticatedHeaders, getCurrentToken } from './authenticatedApi';
import { getToken } from './authApi';

export interface CartItem {
  id: string;
  cartId?: string;
  productId: string;
  quantity: number;
  product?: {
    id: string;
    p_Name: string;
    thumbnail: string;
    price: string;
    discount: number;
  };
}

export interface AddToCartRequest {
  userId: string;
  productId: string;
  quantity: number;
}

export interface AddToCartResponse {
  success: boolean;
  message: string;
  data: CartItem;
}

// Add item to cart
export const addToCartApi = async (cartData: AddToCartRequest, token?: string) => {
  // Get token from localStorage if not provided
  const authToken = token || getToken();
  
  console.log('ðŸ›’ addToCartApi called with:', {
    cartData,
    tokenProvided: !!token,
    tokenFromStorage: !!authToken,
    tokenPreview: authToken ? authToken.substring(0, 20) + '...' : 'null'
  });
  
  if (!authToken) {
    console.error('âŒ No authentication token available');
    throw new Error('Authorization token missing');
  }
  
  try {
    const res = await fetch('http://localhost:5000/v1/cart/', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(cartData),
    });
    
    console.log('ðŸ›’ API Response Status:', res.status);
    console.log('ðŸ›’ API Response Headers:', Object.fromEntries(res.headers.entries()));
    
    const contentType = res.headers.get('content-type') || '';
    let parsed: any = null;
    try {
      parsed = contentType.includes('application/json') ? await res.json() : { message: await res.text() };
    } catch {
      parsed = {};
    }
    
    if (!res.ok) {
      console.error('âŒ Cart API Error:', {
        status: res.status,
        statusText: res.statusText,
        response: parsed
      });
      
      const msg = parsed?.message || parsed?.error || `Failed to add item to cart (status ${res.status})`;
      const error = new Error(msg);
      // @ts-ignore
      (error as any).details = parsed;
      throw error;
    }
    
    console.log('âœ… Add to Cart API Success:', parsed);
    return parsed as AddToCartResponse;
  } catch (error) {
    console.error('âŒ Cart API Exception:', error);
    throw error;
  }
};

// Get cart items for a user
export const getCartItemsApi = async (userId: string, token?: string) => {
  // Get token from localStorage if not provided
  const authToken = token || getToken();
  
  // If there's no token, treat as empty cart rather than throwing
  if (!authToken) {
    return [] as CartItem[];
  }
  
  console.log('ðŸ”‘ Getting cart items with token:', authToken ? authToken.substring(0, 20) + '...' : 'null');
  
  const res = await fetch(`http://localhost:5000/v1/cart/${userId}`, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    cache: 'no-store'
  });
  
  // If unauthorized/forbidden, return empty array to avoid noisy errors in UI
  if (res.status === 401 || res.status === 403) {
    return [] as CartItem[];
  }
  
  const contentType = res.headers.get('content-type') || '';
  let parsed: any = null;
  try {
    parsed = contentType.includes('application/json') ? await res.json() : { message: await res.text() };
  } catch {
    parsed = {};
  }
  
  if (!res.ok) {
    const msg = parsed?.message || parsed?.error || `Failed to fetch cart items (status ${res.status})`;
    const error = new Error(msg);
    // @ts-ignore
    (error as any).details = parsed;
    throw error;
  }
  
  // Debug: Log the API response
  console.log('ðŸ›’ Get Cart Items API Response:', parsed);

  const apiItems = (parsed?.data || []) as Array<{
    id: string;
    product: { id: string; p_Name: string; thumbnail: string; price: string; discount: number };
    quantity: number;
  }>;

  // Map API response to our CartItem shape
  const mapped: CartItem[] = apiItems.map((it) => ({
    id: it.id, // cart item id
    productId: it.product?.id,
    quantity: it.quantity ?? 1,
    product: it.product
  }));

  return mapped;
};

// Update cart item quantity
export const updateCartItemApi = async (cartItemId: string, quantity: number, token?: string) => {
  // Get token from localStorage if not provided
  const authToken = token || getToken();
  
  if (!authToken) {
    throw new Error('Authorization token missing');
  }
  
  const res = await fetch(`http://localhost:5000/v1/cart/${cartItemId}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({ quantity }),
  });
  
  const contentType = res.headers.get('content-type') || '';
  let parsed: any = null;
  try {
    parsed = contentType.includes('application/json') ? await res.json() : { message: await res.text() };
  } catch {
    parsed = {};
  }
  
  if (!res.ok) {
    const msg = parsed?.message || parsed?.error || `Failed to update cart item (status ${res.status})`;
    const error = new Error(msg);
    // @ts-ignore
    (error as any).details = parsed;
    throw error;
  }
  
  return parsed.data || parsed;
};

// Remove item from cart
export const removeFromCartApi = async (cartItemId: string, token?: string) => {
  // Get token from localStorage if not provided
  const authToken = token || getToken();
  
  if (!authToken) {
    throw new Error('Authorization token missing');
  }
  
  const res = await fetch(`http://localhost:5000/v1/cart/${cartItemId}`, {
    method: 'DELETE',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
  });
  
  const contentType = res.headers.get('content-type') || '';
  let parsed: any = null;
  try {
    parsed = contentType.includes('application/json') ? await res.json() : { message: await res.text() };
  } catch {
    parsed = {};
  }
  
  if (!res.ok) {
    const msg = parsed?.message || parsed?.error || `Failed to remove cart item (status ${res.status})`;
    const error = new Error(msg);
    // @ts-ignore
    (error as any).details = parsed;
    throw error;
  }
  
  return parsed.data || parsed;
};
