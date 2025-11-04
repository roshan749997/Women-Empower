"use client";

import React from "react";
import { Heart, ShoppingCart, Check } from "lucide-react";
import { Product } from "@/app/types/product";
import { useWishlist } from "@/app/contexts/WishlistContext";
import { useRouter } from "next/navigation";
import R2Image from "../dashboard/dashboardallproductstab/R2Image";
import { DEFAULT_THUMBNAIL } from "@/app/data/dashboardproductdata";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (productId: string) => void;
  isInCart?: (productId: string) => boolean;
  addingToCart?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onToggleWishlist,
  isInCart,
  addingToCart = false
}) => {
  const { isInWishlist } = useWishlist();
  const router = useRouter();
  
  // Calculate prices
  const originalPrice = parseFloat(product.price);
  const discountAmount = originalPrice * (product.discount / 100);
  const finalPrice = originalPrice - discountAmount;
  
  const inCart = isInCart ? isInCart(product.id) : false;
  const inWishlist = isInWishlist(product.id) || product.is_in_wishlist;

  const handleProductClick = () => {
    router.push(`/products-details?id=${product.id}`);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist?.(product.id);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inCart) {
      // If item is already in cart, navigate to cart page
      router.push('/cart');
    } else {
      // If item is not in cart, add it to cart
      onAddToCart?.(product);
    }
  };

  return (
    <div 
      className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 overflow-hidden h-full flex flex-col cursor-pointer"
      onClick={handleProductClick}
    >
      {/* Product Image */}
      <div className="relative">
        <R2Image
          src={product.thumbnail}
          fallbackSrc={DEFAULT_THUMBNAIL}
          alt={product.p_Name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
            {product.discount}% OFF
          </div>
        )}

        {/* Trending Badge */}
        {product.isTrending && (
          <div 
            className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium"
            style={{ marginTop: product.discount > 0 ? '32px' : '0' }}
          >
            Trending
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-2 right-2 transition-colors bg-white rounded-full p-1.5 shadow-sm hover:scale-110"
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              inWishlist ? "text-red-500 fill-red-500" : "text-gray-600"
            }`}
          />
        </button>
      </div>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="font-medium text-gray-900 mb-3 line-clamp-2 text-sm leading-snug">
          {product.p_Name}
        </h3>

        {/* Spacer to push price and button to bottom */}
        <div className="flex-1"></div>

        {/* Price Section and Button */}
        <div className="flex items-end justify-between mt-auto">
          <div className="flex flex-col">
            {product.discount > 0 ? (
              <>
                <div className="text-lg font-bold text-gray-900">
                  ₹{finalPrice.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500 line-through">
                  ₹{originalPrice.toFixed(2)}
                </div>
              </>
            ) : (
              <div className="text-lg font-bold text-gray-900">
                ₹{originalPrice.toFixed(2)}
              </div>
            )}
          </div>
          
          <button
            onClick={handleAddToCartClick}
            disabled={addingToCart}
            className={`flex items-center gap-1 px-4 py-2 rounded text-xs font-medium transition-all duration-200 ${
              inCart 
                ? "bg-green-600 text-white hover:bg-green-700" 
                : "bg-[#695946] text-white hover:bg-[#61503c] active:scale-95"
            } ${addingToCart ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {addingToCart ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                Adding...
              </>
            ) : inCart ? (
              <>
                <Check className="w-3 h-3" />
                In Cart
              </>
            ) : (
              <>
                <ShoppingCart className="w-3 h-3" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
