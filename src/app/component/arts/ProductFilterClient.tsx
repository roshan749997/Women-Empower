// components/ProductFilterClient.tsx
"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  Grid,
  List,
  SlidersHorizontal,
} from "lucide-react";
import { Product, CartItem, PriceRange  } from "@/app/types/product";
import ProductCard from "./ProductCard";
import Filters from "./Filters";
import Pagination from "./Pagination";
import { searchProducts, filterProducts } from "../../api/products";
import { useWishlist } from "../../contexts/WishlistContext";

interface Category {
  id: string;
  name: string;
  image: string;
}

interface ProductFilterClientProps {
  initialProducts: Product[];
  initialCategories: Category[];
  initialPriceRanges: PriceRange[];
  initialSortOptions: string[];
  error?: string | null;
}

const ProductFilterClient: React.FC<ProductFilterClientProps> = ({
  initialProducts,
  initialCategories,
  initialPriceRanges,
  initialSortOptions,
  error,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("Popular");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [cart, setCart] = useState<CartItem>({});
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  
  // Use WishlistContext instead of local state
  const { addToWishlist, removeFromWishlist, isInWishlist, isLoading: wishlistLoading } = useWishlist();

  // Wishlist is now managed by WishlistContext

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategories, selectedPriceRanges, sortBy]);

  // API integration for search and filtering
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setIsLoading(true);
      setApiError(null);
      
      try {
        let filteredProducts: Product[] = [];
        
        // If we have search term, use search API
        if (searchTerm.trim()) {
          filteredProducts = await searchProducts(searchTerm);
        } else {
          // If we have filters, use filter API
          if (selectedCategories.length > 0 || selectedPriceRanges.length > 0) {
            const filters: any = {};
            
            if (selectedCategories.length > 0) {
              filters.categories = selectedCategories;
            }
            
            if (selectedPriceRanges.length > 0) {
              const priceRange = selectedPriceRanges[0]; // Use first selected range
              const range = initialPriceRanges.find(r => r.label === priceRange);
              if (range) {
                filters.price = {
                  minPrice: range.min,
                  maxPrice: range.max === Infinity ? 999999 : range.max
                };
              }
            }
            
            filteredProducts = await filterProducts(filters);
          } else {
            // No filters, use initial products
            filteredProducts = initialProducts;
          }
        }
        
        setProducts(filteredProducts);
      } catch (err) {
        console.error('Error fetching filtered products:', err);
        setApiError(err instanceof Error ? err.message : 'Failed to fetch products');
        setProducts(initialProducts); // Fallback to initial products
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [searchTerm, selectedCategories, selectedPriceRanges, initialProducts, initialPriceRanges]);

  const toggleCategory = useCallback((categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((c) => c !== categoryId) : [...prev, categoryId]
    );
  }, []);

  const togglePriceRange = useCallback((range: string) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCategories([]);
    setSelectedPriceRanges([]);
    setSearchTerm("");
    setCurrentPage(1);
  }, []);

  // Remove local cart functions since we're using CartContext now

  const toggleWishlist = useCallback(async (productId: string) => {
    try {
      if (isInWishlist(productId)) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      alert('Failed to update wishlist. Please try again.');
    }
  }, [addToWishlist, removeFromWishlist, isInWishlist]);

  const totalCartItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const filteredProducts = useMemo(() => {
    // Since we're now using API filtering, we just need to sort the products
    let filtered = [...products];

    filtered.sort((a, b) => {
      const priceA = parseFloat(a.price);
      const priceB = parseFloat(b.price);

      switch (sortBy) {
        case "Name A-Z":
          return a.p_Name.localeCompare(b.p_Name);
        case "Name Z-A":
          return b.p_Name.localeCompare(a.p_Name);
        case "Price: Low to High":
          return priceA - priceB;
        case "Price: High to Low":
          return priceB - priceA;
        case "Popular":
        default:
          return b.isTrending === a.isTrending ? 0 : b.isTrending ? 1 : -1;
      }
    });

    return filtered;
  }, [products, sortBy]);

  const productsPerPage = isMobile ? 12 : 16;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const goToPage = useCallback((page: number) => {
    if (page === currentPage || isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentPage(page);
    
    const scrollToTop = () => {
      const startPosition = window.pageYOffset;
      const targetPosition = 0;
      const distance = targetPosition - startPosition;
      const duration = 500;
      let startTime: number | null = null;

      const animation = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        const easeInOutQuad = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        
        window.scrollTo(0, startPosition + distance * easeInOutQuad(progress));
        
        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        } else {
          setIsTransitioning(false);
        }
      };
      
      requestAnimationFrame(animation);
    };

    scrollToTop();
  }, [currentPage, isTransitioning]);

  const goToPrevPage = useCallback(() => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, totalPages, goToPage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevPage();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNextPage();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevPage, goToNextPage]);

  return (
    <div className="bg-[#f1f2f4] py-2 sm:py-2 px-2 sm:px-4">
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Arts & Crafts ({filteredProducts.length})
              </h1>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-gray-200"
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-gray-200"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  {initialSortOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      Sort by {opt}
                    </option>
                  ))}
                </select>

                <button
                  className="md:hidden flex items-center gap-2 border border-gray-300 px-3 py-2 rounded-md text-sm hover:bg-gray-50 transition-all duration-200"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </button>
              </div>
            </div>

            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-200 transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex">
            <div className="hidden md:block w-64 border-r border-gray-200 bg-white">
              <Filters
                categories={initialCategories}
                selectedCategories={selectedCategories}
                toggleCategory={toggleCategory}
                priceRanges={initialPriceRanges}
                selectedPriceRanges={selectedPriceRanges}
                togglePriceRange={togglePriceRange}
                clearFilters={clearFilters}
              />
            </div>

            {showFilters && isMobile && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowFilters(false)}>
                <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                  <div className="p-4 border-b flex justify-between items-center bg-white sticky top-0 z-10">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    <button 
                      onClick={() => setShowFilters(false)} 
                      className="text-gray-500 hover:text-gray-700 text-2xl leading-none w-8 h-8 flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                    <Filters
                      categories={initialCategories}
                      selectedCategories={selectedCategories}
                      toggleCategory={toggleCategory}
                      priceRanges={initialPriceRanges}
                      selectedPriceRanges={selectedPriceRanges}
                      togglePriceRange={togglePriceRange}
                      clearFilters={clearFilters}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1 bg-white">
              <div className="p-4 sm:p-6">
                {/* Error State */}
                {(error || apiError) && (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Error loading products
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {error || apiError}
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="bg-[#61503c] text-white px-6 py-2 rounded-md hover:bg-[#7a5b3e] transition-all duration-200 transform hover:scale-105"
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {/* Loading State */}
                {isLoading && (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">⏳</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Loading products...
                    </h3>
                    <p className="text-gray-600">
                      Please wait while we fetch the latest products
                    </p>
                  </div>
                )}

                {/* Products Content */}
                {!isLoading && !error && !apiError && (
                  <>
                    {currentProducts.length > 0 ? (
                      <>
                        <div
                          className={`transition-opacity duration-300 ${
                            isTransitioning ? 'opacity-50' : 'opacity-100'
                          }`}
                        >
                          <div
                            className={
                              viewMode === "grid"
                                ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                                : "space-y-4"
                            }
                          >
                            {currentProducts.map((product, index) => (
                              <div
                                key={product.id}
                                className="animate-fadeIn"
                                style={{
                                  animationDelay: `${index * 50}ms`,
                                  animationFillMode: 'both'
                                }}
                              >
                                <ProductCard 
                                  product={product}
                                  isInWishlist={isInWishlist(product.id)}
                                  toggleWishlist={toggleWishlist}
                                  wishlistLoading={wishlistLoading}
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {totalPages > 1 && (
                          <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            startIndex={startIndex}
                            endIndex={endIndex}
                            totalItems={filteredProducts.length}
                            isTransitioning={isTransitioning}
                            isMobile={isMobile}
                            goToPage={goToPage}
                            goToPrevPage={goToPrevPage}
                            goToNextPage={goToNextPage}
                          />
                        )}
                      </>
                    ) : (
                      <div className="text-center py-16">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          No products found
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Try adjusting your filters or search terms
                        </p>
                        <button
                          onClick={clearFilters}
                          className="bg-[#61503c] text-white px-6 py-2 rounded-md hover:bg-[#695946] transition-all duration-200 transform hover:scale-105"
                        >
                          Clear all filters
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.4s ease-out;
          }
        `}</style>
      </div>
    </div>
  );
};

export default ProductFilterClient;