"use client";

import React, { useEffect, useState } from "react";
import { WishListItem } from "@/app/types/wishlist";
import { WishListClient } from "./WishListClient";
import { useWishlist } from "@/app/contexts/WishlistContext";
import { useAuth } from "@/app/contexts/AuthContext";

interface WishListProps {
  userId?: string;
  className?: string;
}

export default function WishList({ userId, className = "" }: WishListProps) {
  const { wishlistItems, isLoading, refreshWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (isAuthenticated && initialLoad) {
      refreshWishlist();
      setInitialLoad(false);
    }
  }, [isAuthenticated, refreshWishlist, initialLoad]);

  return (
    <div className={`bg-[#f1f2f4] min-h-screen ${className}`}>
      <WishListClient 
        initialItems={wishlistItems} 
        loading={isLoading}
      />
    </div>
  );
}