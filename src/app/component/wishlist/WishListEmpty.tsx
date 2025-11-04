"use client";

import React from "react";
import { Heart, X, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

export const WishListEmpty: React.FC = () => {
  const router = useRouter();

  return (
    <div className="text-center py-16 animate-fadeIn">
      <div className="relative inline-block mb-6">
        <Heart className="w-24 h-24 mx-auto text-gray-300" />
        <div className="absolute inset-0 flex items-center justify-center">
          <X className="w-12 h-12 text-gray-400" />
        </div>
      </div>
      <h2 className="text-2xl font-semibold text-gray-600 mb-4">
        Your wishlist is empty
      </h2>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        Explore our beautiful rangoli collection and add items you love!
      </p>
      <button
        className="bg-[#695846] text-white px-6 py-3 rounded-sm font-medium hover:scale-105 cursor-pointer transition-all duration-200 flex items-center mx-auto"
        onClick={() => router.push("/arts")}
      >
        <ShoppingCart className="w-5 h-5 mr-2" />
        Continue Shopping
      </button>
    </div>
  );
};
