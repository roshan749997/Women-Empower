"use client";

import React, { useState, useRef } from "react";
import { Product } from "@/app/types/product";
import { ProductCard } from "./ProductCard";
import { useCart } from "@/app/contexts/CartContext";
import { useAuth } from "@/app/contexts/AuthContext";
import { useWishlist } from "@/app/contexts/WishlistContext";

interface TrendingProductsClientProps {
  products: Product[];
}

export const TrendingProductsClient = ({ products }: TrendingProductsClientProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [productList, setProductList] = useState<Product[]>(products);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  
  const { addToCart, isInCart } = useCart();
  const { user } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Filter only trending products
  const trendingProducts = productList.filter((p) => p.isTrending);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.children[0]?.clientWidth || 0;
      const gap = 16; // gap-4 (4 * 4px)
      const scrollAmount = cardWidth + gap;

      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });

      setCurrentIndex((prev) => Math.max(0, prev - 1));
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.children[0]?.clientWidth || 0;
      const gap = 16;
      const scrollAmount = cardWidth + gap;

      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });

      setCurrentIndex((prev) => Math.min(trendingProducts.length - 1, prev + 1));
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      setAddingToCart(product.id);
      await addToCart(product.id, 1);
      alert('Item added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(error instanceof Error ? error.message : 'Failed to add item to cart');
    } finally {
      setAddingToCart(null);
    }
  };

  const handleToggleWishlist = async (productId: string) => {
    const product = productList.find(p => p.id === productId);
    if (!product) return;

    try {
      if (isInWishlist(productId)) {
        const success = await removeFromWishlist(productId);
        if (success) {
          setProductList((prevProducts) =>
            prevProducts.map((product) =>
              product.id === productId
                ? { ...product, is_in_wishlist: false }
                : product
            )
          );
          console.log(`Removed from wishlist: ${product.p_Name}`);
        }
      } else {
        const success = await addToWishlist(productId);
        if (success) {
          setProductList((prevProducts) =>
            prevProducts.map((product) =>
              product.id === productId
                ? { ...product, is_in_wishlist: true }
                : product
            )
          );
          console.log(`Added to wishlist: ${product.p_Name}`);
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  // Remove local isInCart function since we're using CartContext

  return (
    <div className="relative">
      {/* Left Navigation Button */}
      <button
        onClick={scrollLeft}
        disabled={currentIndex === 0}
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${
          currentIndex === 0
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-700 hover:bg-gray-50 hover:text-black"
        }`}
        aria-label="Scroll left"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15,18 9,12 15,6"></polyline>
        </svg>
      </button>

      {/* Right Navigation Button */}
      <button
        onClick={scrollRight}
        disabled={currentIndex >= trendingProducts.length - 1}
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${
          currentIndex >= trendingProducts.length - 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-700 hover:bg-gray-50 hover:text-black"
        }`}
        aria-label="Scroll right"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9,18 15,12 9,6"></polyline>
        </svg>
      </button>

      {/* Products Container */}
      <div className="bg-white rounded-lg px-0">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ 
            scrollbarWidth: "none", 
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch"
          }}
        >
          {trendingProducts.map((product: Product) => (
            <div 
              key={product.id} 
              className="flex-shrink-0 w-64 sm:w-72"
            >
              <ProductCard 
                product={product} 
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                isInCart={isInCart}
                addingToCart={addingToCart === product.id}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};