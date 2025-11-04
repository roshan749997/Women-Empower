// components/ProductCard.tsx
"use client";

import React, { useState } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { Product, CartItem } from "@/app/types/product";
import { useCart } from "@/app/contexts/CartContext";
import { useAuth } from "@/app/contexts/AuthContext";
import R2Image from "../dashboard/dashboardallproductstab/R2Image";
import { DEFAULT_THUMBNAIL } from "@/app/data/dashboardproductdata";

interface ProductCardProps {
  product: Product;
  isInWishlist: boolean;
  toggleWishlist: (id: string) => Promise<void>;
  wishlistLoading?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  isInWishlist,
  toggleWishlist,
  wishlistLoading = false
}) => {
  const router = useRouter();
  const { addToCart, isInCart, getCartItemQuantity } = useCart();
  const { user } = useAuth();
  const [addingToCart, setAddingToCart] = useState(false);
  
  const priceNum = parseFloat(product.price);
  const discountedPrice = priceNum - (priceNum * product.discount / 100);
  const cartQuantity = getCartItemQuantity(product.id);
  const isInCartState = isInCart(product.id);

  const handleProductClick = () => {
    router.push(`/products-details?id=${product.id}`);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isInCartState) {
      // If item is already in cart, navigate to cart page
      router.push('/cart');
    } else {
      // If item is not in cart, add it to cart
      try {
        setAddingToCart(true);
        await addToCart(product.id, 1);
        alert('Item added to cart successfully!');
      } catch (error) {
        console.error('Error adding to cart:', error);
        alert(error instanceof Error ? error.message : 'Failed to add item to cart');
      } finally {
        setAddingToCart(false);
      }
    }
  };

  return (
    <div className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 overflow-hidden cursor-pointer" onClick={handleProductClick}>
      <div className="relative">
        <R2Image
          src={product.thumbnail}
          fallbackSrc={DEFAULT_THUMBNAIL}
          alt={product.p_Name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
            {product.discount}% OFF
          </div>
        )}

        {product.isTrending && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium" style={{ marginTop: product.discount > 0 ? '32px' : '0' }}>
            Trending
          </div>
        )}

        <button
          onClick={async (e) => {
            e.stopPropagation();
            if (!wishlistLoading) {
              await toggleWishlist(product.id);
            }
          }}
          disabled={wishlistLoading}
          className={`absolute top-2 right-2 transition-colors bg-white rounded-full p-1.5 shadow-sm hover:scale-110 ${
            wishlistLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isInWishlist ? "text-red-500 fill-red-500" : "text-gray-600"
            }`}
          />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-3 line-clamp-2 text-sm">
          {product.p_Name}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {product.discount > 0 ? (
              <>
                <div className="text-lg font-semibold text-gray-900">
                  ₹{discountedPrice.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500 line-through">
                  ₹{priceNum.toFixed(2)}
                </div>
              </>
            ) : (
              <div className="text-lg font-semibold text-gray-900">
                ₹{priceNum.toFixed(2)}
              </div>
            )}
          </div>
          
          <button 
            onClick={handleAddToCart}
            disabled={addingToCart}
            className={`px-3 py-1.5 rounded text-xs transition-all duration-200 flex items-center gap-1 ${
              isInCartState 
                ? "bg-green-600 text-white hover:bg-green-700" 
                : "bg-[#695946] text-white hover:bg-[#61503c]"
            } ${addingToCart ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {addingToCart && (
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
            )}
            {addingToCart ? "Adding..." : (isInCartState ? "In Cart" : "Add to Cart")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
