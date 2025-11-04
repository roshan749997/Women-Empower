// types/product.ts
export interface Product {
  id: string;
  p_Name: string;
  p_images?: string[];
  thumbnail: string;
  category_id: string;
  artist_id?: string;
  price: string;
  discount: number;
  sell_count?: number;
  description?: string;
  specification?: string;
  isTrending: boolean;
  is_in_wishlist?: boolean;
}

export interface CartItem {
  [key: string]: number;
}

export interface PriceRange {
  label: string;
  min: number;
  max: number;
}