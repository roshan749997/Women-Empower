"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WishListItem } from '../types/wishlist';
import { getWishListItems, addToWishlist, removeFromWishlist } from '../api/wishlistItems';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlistItems: WishListItem[];
  wishlistCount: number;
  isLoading: boolean;
  addToWishlist: (productId: string) => Promise<boolean>;
  removeFromWishlist: (productId: string) => Promise<boolean>;
  isInWishlist: (productId: string) => boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<WishListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const wishlistCount = wishlistItems.length;

  const refreshWishlist = async () => {
    if (!isAuthenticated || !user?.id) {
      setWishlistItems([]);
      return;
    }

    setIsLoading(true);
    try {
      const items = await getWishListItems(user.id);
      setWishlistItems(items);
    } catch (error) {
      console.error('Error refreshing wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToWishlist = async (productId: string): Promise<boolean> => {
    if (!isAuthenticated || !user?.id) {
      console.error('User not authenticated');
      return false;
    }

    try {
      const success = await addToWishlist(productId, user.id);
      if (success) {
        // Refresh the wishlist to get updated data
        await refreshWishlist();
      }
      return success;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return false;
    }
  };

  const handleRemoveFromWishlist = async (productId: string): Promise<boolean> => {
    if (!isAuthenticated || !user?.id) {
      console.error('User not authenticated');
      return false;
    }

    try {
      // Find the wishlist item ID for this product
      const wishlistItem = wishlistItems.find(item => item.id === productId);
      if (!wishlistItem || !wishlistItem.wishlistItemId) {
        console.error('Product not found in wishlist or missing wishlist item ID');
        return false;
      }

      // Use the wishlist item ID for deletion
      const success = await removeFromWishlist(wishlistItem.wishlistItemId);
      if (success) {
        // Remove from local state immediately for better UX
        setWishlistItems(prev => prev.filter(item => item.id !== productId));
      }
      return success;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return false;
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.some(item => item.id === productId);
  };

  // Load wishlist when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      refreshWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [isAuthenticated, user?.id]);

  const value: WishlistContextType = {
    wishlistItems,
    wishlistCount,
    isLoading,
    addToWishlist: handleAddToWishlist,
    removeFromWishlist: handleRemoveFromWishlist,
    isInWishlist,
    refreshWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
