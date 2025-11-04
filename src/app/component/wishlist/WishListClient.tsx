"use client";

import React from "react";
import { WishListItem } from "@/app/types/wishlist";
import { WishListHeader } from "./WishListHeader";
import { WishListCard } from "./WishListCard";
import { WishListEmpty } from "./WishListEmpty";
import { WishListSkeleton } from "./WishListSkeleton";
import { useWishlist } from "@/app/contexts/WishlistContext";

interface WishListClientProps {
  initialItems: WishListItem[];
  loading?: boolean;
}

export const WishListClient: React.FC<WishListClientProps> = ({ 
  initialItems,
  loading = false
}) => {
  const { wishlistItems, removeFromWishlist } = useWishlist();

  const handleRemoveFromWishList = async (productId: string) => {
    await removeFromWishlist(productId);
  };

  const removeAllItems = async () => {
    // Remove all items from wishlist
    const removePromises = wishlistItems.map(item => removeFromWishlist(item.id));
    await Promise.all(removePromises);
  };

  const addToCart = (item: WishListItem) => {
    console.log("Adding to cart:", item);
    // TODO: Implement add to cart functionality
  };

  const moveToCart = async (item: WishListItem) => {
    addToCart(item);
    setTimeout(async () => {
      await handleRemoveFromWishList(item.id);
    }, 500);
  };

  return (
    <div className="min-h-screen px-0 bg-gray-50">
      {/* Header - Only show when items exist */}
      {!loading && wishlistItems.length > 0 && (
        <WishListHeader 
          itemCount={wishlistItems.length} 
          onRemoveAll={removeAllItems}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          // Loading state with skeleton cards
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-none">
            {Array.from({ length: 10 }).map((_, index) => (
              <WishListSkeleton key={index} />
            ))}
          </div>
        ) : wishlistItems.length === 0 ? (
          // Empty Wishlist State
          <WishListEmpty />
        ) : (
          // Wishlist Items Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-none">
            {wishlistItems.map((item, index) => (
              <WishListCard
                key={item.id}
                item={item}
                index={index}
                onRemove={handleRemoveFromWishList}
                onMoveToCart={moveToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};