'use client';
import React, { useState, useEffect } from "react";
import { Heart, Star, Plus, Minus, ShoppingCart } from "lucide-react";
import { productService } from "@/app/lib/productapi";
import R2Image from "../dashboard/dashboardallproductstab/R2Image";
import { DEFAULT_THUMBNAIL } from "@/app/data/dashboardproductdata";
import { Product } from "@/app/types/product";
import { useCart } from "@/app/contexts/CartContext";
import { useAuth } from "@/app/contexts/AuthContext";
import { useWishlist } from "@/app/contexts/WishlistContext";
import { getCategoryDetailsApi, getArtistDetailsApi } from "@/app/lib/api";

interface ProductDetailsPageProps {
  productId?: string;
}

const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ productId }) => {
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<boolean>(false);
  const [categoryName, setCategoryName] = useState<string>('');
  const [artistName, setArtistName] = useState<string>('');
  
  const { addToCart, isInCart } = useCart();
  const { user } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Fetch product details when component mounts or productId changes
  useEffect(() => {
    const fetchProductDetails = async (): Promise<void> => {
      if (!productId) {
        setError('No product ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const productData = await productService.getProductDetails(productId);
        
        if (productData) {
          // Ensure price is a string for compatibility
          const normalizedProduct: Product = {
            ...productData,
            price: productData.price?.toString() ?? "0",
            isTrending: productData.isTrending ?? false
          };
          setProduct(normalizedProduct);

          // Fetch category and artist names
          try {
            if (productData.category_id) {
              const categoryData = await getCategoryDetailsApi(productData.category_id);
              setCategoryName(categoryData?.name || 'Unknown Category');
            }
          } catch (err) {
            console.warn('Error fetching category details:', err);
            setCategoryName('Unknown Category');
          }

          try {
            if (productData.artist_id) {
              const artistData = await getArtistDetailsApi(productData.artist_id);
              setArtistName(artistData?.artist_Name || 'Unknown Artist');
            }
          } catch (err) {
            console.warn('Error fetching artist details:', err);
            setArtistName('Unknown Artist');
          }
        } else {
          setError('Product not found');
        }
      } catch (err: unknown) {
        console.error('Error fetching product details:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  // Update wishlist state when product changes
  useEffect(() => {
    if (product) {
      setIsWishlisted(isInWishlist(product.id));
    }
  }, [product, isInWishlist]);

  // Build image gallery: include thumbnail + additional images, dedupe empties
  const productImages: string[] = product
    ? Array.from(
        new Set(
          [product.thumbnail, ...(product.p_images || [])]
            .filter((s): s is string => !!s && s.trim() !== "")
        )
      )
    : [];

  const handleAddToCart = async (): Promise<void> => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }

    if (!product) {
      alert('Product not found');
      return;
    }

    try {
      setAddingToCart(true);
      await addToCart(product.id, quantity);
      alert('Item added to cart successfully!');
    } catch (error: unknown) {
      console.error('Error adding to cart:', error);
      alert(error instanceof Error ? error.message : 'Failed to add item to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleWishlist = async (): Promise<void> => {
    if (!user) {
      alert('Please login to manage wishlist');
      return;
    }

    if (!product) {
      alert('Product not found');
      return;
    }

    try {
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id);
        setIsWishlisted(false);
        console.log('Product removed from wishlist');
      } else {
        await addToWishlist(product.id);
        setIsWishlisted(true);
        console.log('Product added to wishlist');
      }
    } catch (error: unknown) {
      console.error('Error toggling wishlist:', error);
      alert(error instanceof Error ? error.message : 'Failed to update wishlist');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-[#f1f2f4] py-2 sm:py-2 px-2 sm:px-4">
        <div className="min-h-screen bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-6">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#695946] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading product details...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-[#f1f2f4] py-2 sm:py-2 px-2 sm:px-4">
        <div className="min-h-screen bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-6">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Error Loading Product</h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="bg-[#695946] text-white px-6 py-2 rounded-lg hover:bg-[#5a4a3a] transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If no product, return null
  if (!product) {
    return null;
  }

  const discountedPrice: number = parseFloat(product.price) - (parseFloat(product.price) * product.discount / 100);

  // Split specification by comma and create array
  const specificationItems: string[] = product.specification 
    ? product.specification.split(',').map(item => item.trim()).filter(item => item !== '')
    : [
        "Premium quality roses sourced from the finest gardens",
        "Long-lasting freshness with proper care instructions included",
        "Eco-friendly packaging with sustainable materials"
      ];

  return (
     <div className="bg-[#f1f2f4] py-2 sm:py-2 px-2 sm:px-4">
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-6">
        
        {/* Main Product Grid */}
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Image Section - Modified Layout */}
            {productImages.length > 0 && (
              <div className="p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Thumbnail Images - Left Side */}
                  {productImages.length > 1 && (
                    <div className="flex lg:flex-col gap-2 order-2 lg:order-1">
                      {productImages.map((image: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`w-20 h-20 lg:w-24 lg:h-24 rounded-lg overflow-hidden border transition-all duration-200 ${
                            selectedImage === index 
                              ? "border-[#695946] border-2 ring-2 ring-[#695946]/20" 
                              : "border-gray-200 hover:border-[#695946]"
                          }`}
                        >
                          <R2Image
                            src={image}
                            alt={`View ${index + 1}`}
                            className="w-full h-full object-cover"
                            fallbackSrc={DEFAULT_THUMBNAIL}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Main Image - Right Side */}
                  <div className="flex-1 order-1 lg:order-2">
                    <div className="relative aspect-[4/5] lg:aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                      {/* Trending Badge */}
                      <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-xs px-2 py-1 rounded-md font-medium">
                        Trending
                      </div>
                      <R2Image
                        src={productImages[selectedImage]}
                        fallbackSrc={DEFAULT_THUMBNAIL}
                        alt={product.p_Name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Product Details */}
            <div className="p-6 lg:p-8">
              
              {/* Title */}
              <div className="mb-6">
                <h1 className="text-2xl lg:text-3xl text-gray-900 mb-2">
                  {product.p_Name}
                </h1>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-3xl text-gray-900">
                    ₹{discountedPrice.toLocaleString()}
                  </span>
                  <span className="text-lg text-gray-400 line-through">
                    ₹{parseFloat(product.price).toLocaleString()}
                  </span>
                  {product.discount > 0 && (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  You save: ₹{(parseFloat(product.price) - discountedPrice).toLocaleString()}
                </p>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-3">Quantity</label>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-gray-50 transition-colors border-r border-gray-200"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 py-3 font-medium min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-gray-50 transition-colors border-l border-gray-200"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-8">
                <button 
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-2 ${
                    addingToCart 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-[#695946] hover:bg-[#5a4a3a]'
                  } text-white`}
                >
                  {addingToCart && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  {addingToCart ? 'Adding to Cart...' : 'Add to Cart'}
                </button>
                
                <div className="flex gap-3">
                  <button className="flex-1 border border-gray-200 text-gray-900 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    <ShoppingCart size={18} />
                    Buy Now
                  </button>
                  
                  <button
                    onClick={handleToggleWishlist}
                    className={`px-4 py-3 rounded-lg border transition-all duration-200 ${
                      isWishlisted
                        ? "border-red-200 bg-red-50 text-red-600"
                        : "border-gray-200 hover:bg-gray-50 text-gray-600 hover:border-red-200"
                    }`}
                  >
                    <Heart size={18} className={isWishlisted ? "fill-current" : ""} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Section - Single Page Layout */}
        <div className="bg-white rounded-xl  mt-6 p-6 lg:p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Product Details
          </h2>
          
          {/* Description Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Description</h3>
            <div className="text-gray-600 leading-relaxed">
              {product.description ? (
                <p>{product.description}</p>
              ) : (
                <p>Sunset Overdrive flowers2 is a beautiful arrangement of vibrant roses that capture the warm hues of a sunset. Each flower is carefully selected and arranged to create a stunning visual display that brings the beauty of nature into your space. Perfect for special occasions or as a thoughtful gift to brighten someone's day.</p>
              )}
            </div>
          </div>
          
          {/* Specifications Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Specifications</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              {specificationItems.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          
          {/* Product Information Section */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Product Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Category</p>
                <p className="text-gray-900 font-medium">{categoryName || 'Loading...'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Artist</p>
                <p className="text-gray-900 font-medium">{artistName || 'Loading...'}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    </div>
  );
};

export default ProductDetailsPage;
