// components/ProductCard.tsx
'use client';
import React from "react";
import { Star, TrendingUp, MoreVertical, Eye, Edit, Trash2, Tag } from "lucide-react";
import { Product, DrawerMode } from "@/app/types/dashboardproduct";
import { calculateDiscountedPrice } from "@/app/lib/utils/dashboardproduct-utils";
import { DEFAULT_THUMBNAIL } from "@/app/data/dashboardproductdata";
import R2Image from "./R2Image";

interface ProductCardProps {
  product: Product;
  showDropdown: string | null;
  onToggleDropdown: (id: string | null) => void;
  onOpenDrawer: (mode: DrawerMode, product: Product) => void;
  onToggleTrending: (id: string) => void;
  onDelete: (id: string) => void;
  onViewDetails: (id: string) => void;
  artistNameMap?: Record<string, string>;
  categoryNameMap?: Record<string, string>;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showDropdown,
  onToggleDropdown,
  onOpenDrawer,
  onToggleTrending,
  onDelete,
  onViewDetails,
  artistNameMap,
  categoryNameMap,
}) => {
  return (
    <div
      className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-100"
      data-product-id={product.id}
    >
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <R2Image
          src={product.thumbnail}
          fallbackSrc={DEFAULT_THUMBNAIL}
          alt={product.p_Name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-2.5 py-1 rounded-md text-xs font-bold shadow-lg">
            -{product.discount}% OFF
          </div>
        )}
        
        {/* Trending Badge */}
        {product.isTrending && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-2.5 py-1 rounded-md flex items-center gap-1 text-xs font-bold shadow-lg">
            <TrendingUp className="w-3.5 h-3.5" />
            Trending
          </div>
        )}

        {/* Category Badge */}
        {product.category_id && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 px-2.5 py-1 rounded-md flex items-center gap-1.5 text-xs font-medium shadow-md">
            <Tag className="w-3 h-3 text-blue-600" />
            <span>{categoryNameMap?.[product.category_id] || "Unknown Category"}</span>
          </div>
        )}

        {/* Three Dots Menu */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleDropdown(showDropdown === product.id ? null : product.id);
            }}
            className="bg-white/95 backdrop-blur-sm hover:bg-white text-gray-700 p-2 rounded-full shadow-lg transition-all duration-150 hover:shadow-xl hover:scale-110"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 text-base mb-2 line-clamp-2 min-h-[3rem] group-hover:text-blue-600 transition-colors">
          {product.p_Name}
        </h3>

        {/* Artist Name */}
        {(artistNameMap?.[product.artist_id] || product.artist_id) && (
          <p className="text-sm text-gray-600 mb-3 flex items-center gap-1.5">
            <span className="text-gray-400">by</span>
            <span className="font-medium text-gray-700">{artistNameMap?.[product.artist_id] || product.artist_id}</span>
          </p>
        )}

        {/* Price Section */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-gray-900">
              ₹{calculateDiscountedPrice(product.price, product.discount).toLocaleString()}
            </span>
            {product.discount > 0 && (
              <span className="text-sm text-gray-400 line-through">
                ₹{product.price.toLocaleString()}
              </span>
            )}
          </div>      
        </div>
      </div>

      {/* Dropdown Menu */}
      {showDropdown === product.id && (
        <div
          className="fixed z-50 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 animate-in fade-in slide-in-from-top-2 duration-200"
          style={{
            top: `${
              (document.querySelector(`[data-product-id="${product.id}"]`) as HTMLElement)
                ?.getBoundingClientRect().top || 0
            }px`,
            left: `${
              ((document.querySelector(`[data-product-id="${product.id}"]`) as HTMLElement)
                ?.getBoundingClientRect().right || 0) - 224
            }px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => (onViewDetails ? onViewDetails(product.id) : onOpenDrawer("view", product))}
            className="w-full text-left px-4 py-2.5 hover:bg-blue-50 flex items-center gap-3 text-sm text-gray-700 transition-colors rounded-lg mx-1"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Eye className="w-4 h-4 text-blue-600" />
            </div>
            <span className="font-medium">View Details</span>
          </button>
          
          <button
            onClick={() => onOpenDrawer("edit", product)}
            className="w-full text-left px-4 py-2.5 hover:bg-green-50 flex items-center gap-3 text-sm text-gray-700 transition-colors rounded-lg mx-1"
          >
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <Edit className="w-4 h-4 text-green-600" />
            </div>
            <span className="font-medium">Edit Product</span>
          </button>
          
          <button
            onClick={() => onToggleTrending(product.id)}
            className="w-full text-left px-4 py-2.5 hover:bg-orange-50 flex items-center gap-3 text-sm text-gray-700 transition-colors rounded-lg mx-1"
          >
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-orange-600" />
            </div>
            <span className="font-medium">
              {product.isTrending ? "Remove from Trending" : "Add to Trending"}
            </span>
          </button>
          
          <div className="border-t border-gray-200 my-2 mx-2"></div>
          
          <button
            onClick={() => onDelete(product.id)}
            className="w-full text-left px-4 py-2.5 hover:bg-red-50 flex items-center gap-3 text-sm text-red-600 transition-colors rounded-lg mx-1"
          >
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
              <Trash2 className="w-4 h-4 text-red-600" />
            </div>
            <span className="font-medium">Delete Product</span>
          </button>
        </div>
      )}
    </div>
  );
};
