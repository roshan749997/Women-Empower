"use client";

import React from "react";
import { Heart, Check, Sparkles } from "lucide-react";
import { WishListItem } from "@/app/types/wishlist";
import R2Image from "../dashboard/dashboardallproductstab/R2Image";
import { DEFAULT_THUMBNAIL } from "@/app/data/dashboardproductdata";

interface WishListCardProps {
  item: WishListItem;
  index: number;
  onRemove: (id: string) => void;
  onMoveToCart: (item: WishListItem) => void;
}

export const WishListCard: React.FC<WishListCardProps> = ({ 
  item, 
  index,
  onRemove, 
  onMoveToCart 
}) => {
  const netPrice = parseFloat(item.price);
  const discountPercentage = item.discount || 0;
  const offerPrice =
    discountPercentage > 0
      ? netPrice - (netPrice * discountPercentage) / 100
      : netPrice;

  return (
    <div
      className="group bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden w-full transform hover:-translate-y-1 animate-fadeIn"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="relative overflow-hidden">
        <R2Image
          src={item.thumbnail}
          fallbackSrc={DEFAULT_THUMBNAIL}
          alt={item.p_Name}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
            {discountPercentage}% OFF
          </div>
        )}

        {/* Trending Badge */}
        {item.isTrending && (
          <div className="absolute top-2 right-2 bg-purple-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center">
            <Sparkles className="w-3 h-3 mr-1" />
            Trending
          </div>
        )}

        {/* Heart button */}
        <button
          onClick={() => onRemove(item.id)}
          className="absolute bottom-2 right-2 transition-all duration-200 bg-white rounded-full p-2 shadow-md hover:bg-red-50 group-hover:scale-110"
        >
          <Heart className="w-5 h-5 text-red-500 fill-rose-500 hover:fill-red-600" />
        </button>
      </div>

      <div className="p-4">
        {/* Category */}
        <div className="mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wide">
            {item.category_id}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-medium text-gray-900 mb-3 line-clamp-2 text-sm group-hover:text-[#695846] transition-colors">
          {item.p_Name}
        </h3>

        {/* Price Section */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {discountPercentage > 0 ? (
              <>
                <div className="text-lg font-semibold text-gray-900">
                  ₹{offerPrice.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500 line-through">
                  ₹{netPrice.toFixed(2)}
                </div>
              </>
            ) : (
              <div className="text-lg font-semibold text-gray-900">
                ₹{netPrice.toFixed(2)}
              </div>
            )}
          </div>
          {item.inCart ? (
            <button className="bg-green-500 text-white px-3 py-2 rounded-md text-xs font-light flex items-center gap-1 cursor-default">
              <Check className="w-3 h-3" />
              In Cart
            </button>
          ) : (
            <button
              onClick={() => onMoveToCart(item)}
              className="bg-[#695946] text-white px-3 py-2 rounded-md text-xs font-light hover:bg-transparent hover:text-[#695946] border border-[#695946] transition-all duration-300 cursor-pointer"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
