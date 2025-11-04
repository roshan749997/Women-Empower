"use client";

import React, { useState, useRef, useEffect } from "react";
import { Heart, ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/app/contexts/CartContext";
import { useAuth } from "@/app/contexts/AuthContext";
import { productService } from "@/app/lib/productapi";
import R2Image from "../dashboard/dashboardallproductstab/R2Image";
import { DEFAULT_THUMBNAIL } from "@/app/data/dashboardproductdata";

// Product Interface - Updated to match your data structure
export interface Product {
  id: string;
  p_Name: string;
  thumbnail: string;
  category_id: string;
  price: string;
  discount: number;
  isTrending: boolean;
  is_in_wishlist?: boolean;
}

// ProductCardNew Component
interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (productId: string) => void;
  isInCart?: (productId: string) => boolean;
  addingToCart?: boolean;
}

const ProductCardNew: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onToggleWishlist,
  isInCart,
  addingToCart = false
}) => {
  // Calculate prices
  const originalPrice = parseFloat(product.price);
  const discountAmount = originalPrice * (product.discount / 100);
  const finalPrice = originalPrice - discountAmount;
  
  const inCart = isInCart ? isInCart(product.id) : false;

  return (
    <div className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 overflow-hidden h-full flex flex-col">
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
          onClick={() => onToggleWishlist?.(product.id)}
          className="absolute top-2 right-2 transition-colors bg-white rounded-full p-1.5 shadow-sm hover:scale-110"
          aria-label={product.is_in_wishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              product.is_in_wishlist ? "text-red-500 fill-red-500" : "text-gray-600"
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
            onClick={() => {
              if (inCart) {
                // If item is already in cart, navigate to cart page
                window.location.href = '/cart';
              } else {
                // If item is not in cart, add it to cart
                onAddToCart?.(product);
              }
            }}
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

// Sample Products Data - Updated with your data structure
const allProducts: Product[] = [
  {
    id: "5270616e-39ef-4512-9773-45f6c66b4a33",
    p_Name: "Sunset Overdrive flowers2",
    thumbnail: "https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg",
    category_id: "5f44d48f-033a-4bf6-9233-11cf8e99f28b",
    price: "699.00",
    discount: 15,
    isTrending: true,
    is_in_wishlist: false
  },
  {
    id: "a1b2c3d4-e5f6-4789-9abc-def012345678",
    p_Name: "Beautiful Rose Garden Collection",
    thumbnail: "https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg",
    category_id: "5f44d48f-033a-4bf6-9233-11cf8e99f28b",
    price: "899.00",
    discount: 20,
    isTrending: true,
    is_in_wishlist: false
  },
  {
    id: "b2c3d4e5-f6a7-4890-9bcd-ef0123456789",
    p_Name: "Premium Flower Arrangement",
    thumbnail: "https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg",
    category_id: "5f44d48f-033a-4bf6-9233-11cf8e99f28b",
    price: "1299.00",
    discount: 10,
    isTrending: true,
    is_in_wishlist: false
  },
  {
    id: "c3d4e5f6-a7b8-4901-9cde-f01234567890",
    p_Name: "Elegant Pink Roses Bundle",
    thumbnail: "https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg",
    category_id: "5f44d48f-033a-4bf6-9233-11cf8e99f28b",
    price: "549.00",
    discount: 25,
    isTrending: true,
    is_in_wishlist: false
  },
  {
    id: "d4e5f6a7-b8c9-4012-9def-012345678901",
    p_Name: "Red Rose Special Collection",
    thumbnail: "https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg",
    category_id: "5f44d48f-033a-4bf6-9233-11cf8e99f28b",
    price: "799.00",
    discount: 15,
    isTrending: true,
    is_in_wishlist: false
  },
  {
    id: "e5f6a7b8-c9d0-4123-9ef0-123456789012",
    p_Name: "Mixed Roses Bouquet",
    thumbnail: "https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg",
    category_id: "5f44d48f-033a-4bf6-9233-11cf8e99f28b",
    price: "999.00",
    discount: 18,
    isTrending: true,
    is_in_wishlist: true
  },
  {
    id: "f6a7b8c9-d0e1-4234-9f01-234567890123",
    p_Name: "Garden Fresh Flowers Set",
    thumbnail: "https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg",
    category_id: "5f44d48f-033a-4bf6-9233-11cf8e99f28b",
    price: "649.00",
    discount: 12,
    isTrending: true,
    is_in_wishlist: true
  },
  {
    id: "a7b8c9d0-e1f2-4345-9012-345678901234",
    p_Name: "Luxury Rose Arrangement",
    thumbnail: "https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg",
    category_id: "5f44d48f-033a-4bf6-9233-11cf8e99f28b",
    price: "1499.00",
    discount: 30,
    isTrending: true,
    is_in_wishlist: false
  },
  {
    id: "19",
    p_Name: "Peacock Feather Rangoli",
    thumbnail: "https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg",
    category_id: "rangoli",
    price: "375.00",
    discount: 12,
    isTrending: false,
    is_in_wishlist: true
  }
];

// RelatedProducts Main Component
interface RelatedProductsProps {
  categoryId?: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ categoryId }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { addToCart, isInCart } = useCart();
  const { user } = useAuth();

  // Fetch related products when categoryId changes
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!categoryId) {
        // Fallback to sample data if no categoryId provided
        setProducts(allProducts.filter((p) => p.isTrending));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const relatedProducts = await productService.getRelatedProducts(categoryId);
        setProducts(relatedProducts);
      } catch (err) {
        console.error('Error fetching related products:', err);
        setError('Failed to load related products');
        // Fallback to sample data on error
        setProducts(allProducts.filter((p) => p.isTrending));
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [categoryId]);

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

      setCurrentIndex((prev) => Math.min(products.length - 1, prev + 1));
    }
  };

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }

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

  const handleToggleWishlist = (productId: string) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, is_in_wishlist: !product.is_in_wishlist }
          : product
      )
    );
    
    const product = products.find(p => p.id === productId);
    if (product) {
      console.log(
        product.is_in_wishlist 
          ? `Removed from wishlist: ${product.p_Name}` 
          : `Added to wishlist: ${product.p_Name}`
      );
    }
  };

  // Remove local isInCart function since we're using CartContext

  return (
    <div className="bg-[#f1f2f4] py-2 sm:py-2 px-2 sm:px-4">
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-5 bg-white rounded-sm">
        <div className="mb-4 sm:mb-5 text-left">
          <h2 className="text-black text-2xl sm:text-3xl font-bold">Releted Products</h2>
        </div>

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
            disabled={currentIndex >= products.length - 1}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${
              currentIndex >= products.length - 1
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
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#695946]"></div>
                <span className="ml-2 text-gray-600">Loading related products...</span>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center py-8">
                <span className="text-red-500">{error}</span>
              </div>
            ) : products.length === 0 ? (
              <div className="flex justify-center items-center py-8">
                <span className="text-gray-500">No related products found</span>
              </div>
            ) : (
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
              style={{ 
                scrollbarWidth: "none", 
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch"
              }}
            >
                {products.map((product: Product) => (
                <div 
                  key={product.id} 
                  className="flex-shrink-0 w-64 sm:w-72"
                >
                  <ProductCardNew 
                    product={product} 
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                    isInCart={isInCart}
                    addingToCart={addingToCart === product.id}
                  />
                </div>
              ))}
            </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default RelatedProducts;
