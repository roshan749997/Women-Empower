export interface WishListItem {
  id: string; // Product ID
  wishlistItemId?: string; // Wishlist item ID for deletion
  p_Name: string;
  thumbnail: string;
  category_id: string;
  price: string;
  discount: number;
  isTrending: boolean;
  is_in_wishlist: boolean;
  inCart?: boolean;
}