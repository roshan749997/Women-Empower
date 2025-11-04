"use client";
import React, { useRef, useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Visibility,
} from "@mui/icons-material";
import { Heart, ShoppingCart } from "lucide-react";
import "@/app/globals.css";
import { getArtistProducts, ArtistProduct } from "@/app/lib/artistApi";
import { useCart } from "@/app/contexts/CartContext";
import { useWishlist } from "@/app/contexts/WishlistContext";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import R2Image from "../dashboard/dashboardallproductstab/R2Image";
import { DEFAULT_THUMBNAIL } from "@/app/data/dashboardproductdata";

interface ArtworkItem {
  p_Name: string;
  thumbnail: string;
  category_id: string;
  artist_id: string;
  price: string;
  discount: number;
  isTrending: boolean;
}

interface ArtistWorkProps {
  artistId: string;
}

const ArtistWork: React.FC<ArtistWorkProps> = ({ artistId }) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [artworks, setArtworks] = useState<ArtistProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Fetch artist products on component mount
  useEffect(() => {
    const fetchArtistProducts = async () => {
      try {
        setLoading(true);
        const products = await getArtistProducts(artistId);
        setArtworks(products);
      } catch (error) {
        console.error('Error fetching artist products:', error);
        setArtworks([]);
      } finally {
        setLoading(false);
      }
    };

    if (artistId) {
      fetchArtistProducts();
    }
  }, [artistId]);

  // Handle add to cart
  const handleAddToCart = async (product: ArtistProduct) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      setAddingToCart(product.id);
      await addToCart(product.id, 1);
      console.log('Product added to cart successfully');
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(null);
    }
  };

  // Handle wishlist toggle
  const handleToggleWishlist = async (product: ArtistProduct) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id);
        console.log('Product removed from wishlist');
      } else {
        await addToWishlist(product.id);
        console.log('Product added to wishlist');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  // Handle view details
  const handleViewDetails = (productId: string) => {
    router.push(`/products-details?id=${productId}`);
  };

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const cardWidth = 280;
      const scrollAmount = cardWidth * 2;

      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });

      setTimeout(checkScrollButtons, 400);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    container?.addEventListener("scroll", checkScrollButtons);
    return () => container?.removeEventListener("scroll", checkScrollButtons);
  }, []);

  // Calculate discounted price
  const calculateDiscountedPrice = (price: string, discount: number) => {
    const originalPrice = parseFloat(price);
    const discountAmount = originalPrice * (discount / 100);
    return (originalPrice - discountAmount).toFixed(2);
  };

  return (
    <div className="bg-[#f1f2f4] py-2 sm:py-2 px-2 sm:px-4">
      <section className="relative p-4 sm:p-6 bg-gray-50 rounded-sm">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl text-black mb-2">
            Artist Work's
          </h2>
        </div>

        <div className="relative">
          {/* Left Scroll Button */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-md bg-white text-gray-700 hover:bg-gray-100"
            >
              <ChevronLeft />
            </button>
          )}

          {/* Right Scroll Button */}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-md bg-white text-gray-700 hover:bg-gray-100"
            >
              <ChevronRight />
            </button>
          )}

          {/* Scrollable Cards */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {loading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-64 bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse"
                >
                  <div className="w-full h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))
            ) : artworks.length === 0 ? (
              // Empty state
              <div className="flex-shrink-0 w-full text-center py-8">
                <p className="text-gray-500">No artworks found for this artist.</p>
              </div>
            ) : (
              artworks.map((artwork, index) => (
                <div
                  key={artwork.id}
                  className="flex-shrink-0 w-64 bg-white rounded-2xl shadow-sm hover:shadow-xl 
                           transition-all duration-300 overflow-hidden group"
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden">
                    <R2Image
                      src={artwork.thumbnail}
                      fallbackSrc={DEFAULT_THUMBNAIL}
                      alt={artwork.p_Name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Wishlist Button */}
                    <button
                      onClick={() => handleToggleWishlist(artwork)}
                      className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow-sm hover:scale-110 transition-all"
                      aria-label={isInWishlist(artwork.id) ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          isInWishlist(artwork.id) ? "text-red-500 fill-red-500" : "text-gray-600"
                        }`}
                      />
                    </button>

                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 
                                 transition-all duration-300 flex items-center justify-center">
                      <button
                        onClick={() => handleViewDetails(artwork.id)}
                        className="opacity-0 group-hover:opacity-100 bg-white text-gray-800 
                                 px-4 py-2 rounded-full font-semibold flex items-center gap-2
                                 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                      >
                        <Visibility fontSize="small" />
                        View Details
                      </button>
                    </div>

                    {/* Trending Badge */}
                    {artwork.isTrending && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Trending
                        </span>
                      </div>
                    )}

                    {/* Discount Badge */}
                    {artwork.discount > 0 && (
                      <div className="absolute bottom-3 left-3">
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          {artwork.discount}% OFF
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 text-lg mb-1 line-clamp-1">
                      {artwork.p_Name}
                    </h3>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-3">
                      {artwork.discount > 0 ? (
                        <>
                          <span className="text-lg font-bold text-gray-900">
                            ₹{calculateDiscountedPrice(artwork.price, artwork.discount)}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            ₹{artwork.price}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">
                          ₹{artwork.price}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAddToCart(artwork)}
                        disabled={addingToCart === artwork.id}
                        className={`flex-1 bg-[#695946] hover:bg-[#61503c] text-white px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center justify-center gap-1 ${
                          addingToCart === artwork.id ? 'opacity-50 cursor-not-allowed' : ''
                        } ${isInCart(artwork.id) ? 'bg-green-600 hover:bg-green-700' : ''}`}
                      >
                        {addingToCart === artwork.id ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                            Adding...
                          </>
                        ) : isInCart(artwork.id) ? (
                          <>
                            <ShoppingCart className="w-3 h-3" />
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
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ArtistWork;
